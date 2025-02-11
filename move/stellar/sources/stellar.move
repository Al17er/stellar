module stellar::stellar;
use std::string::String;
use sui::bag::add;
use sui::clock;
use sui::event;
use sui::kiosk::{owner, has_access};
use sui::table::{Self,Table};
use sui::tx_context::sender;

public struct Profile has key{
    id:UID,
    name:String,
    owner:address,
}

public struct AccountBook has key{
    id:UID,
    category:String,
    content:Table<u64,Account_content>,
    owner:address,
}

public struct Account_content has store{
    dateTime:String,
    money:u64,
    description:String,
}

public struct State has key{
    id:UID,
    users:Table<address,address>
}

const EPROFILE:u64=500;

public entry fun Account_Book_create(profile:&mut Profile,catgory:String,ctx:&mut TxContext){
    let owner=tx_context::sender(ctx);
    assert!(profile.owner==owner);
    let acbook=AccountBook{
        id:object::new(ctx),
        category:catgory,
        content:table::new(ctx),
        owner:owner,
    };
    transfer::transfer(acbook,owner)
}

public entry fun add_content(acbook:&mut AccountBook,dateTime:String,money:u64,description:String, order:u64,ctx:&mut TxContext){
    let owner=tx_context::sender(ctx);
    assert!((owner==acbook.owner),0);
    let acontent=Account_content{
        dateTime,
        money,
        description,
    };
    table::add(&mut acbook.content,order,acontent);
}

public struct ProfileCreate has copy,drop{
    id:ID,
    owner: address,
}

// public struct Account_content_added has copy,drop{
//     order:u64,
//     bookid:ID,
//     content:
// }

fun init(ctx:&mut TxContext){
    transfer::share_object(State{
        id:object::new(ctx),
        users:table::new(ctx)
    });
}

public entry fun create_profile(
    name:String,
    state:&mut State,
    ctx:&mut TxContext
){
    let owner=tx_context::sender(ctx);
    assert!(!table::contains(&state.users,owner),EPROFILE);
    let uid=object::new(ctx);
    let id = object::uid_to_inner(&uid);
    let user_profile = Profile{
        id:uid,
        name,
        owner,
    };
    transfer::transfer(user_profile,owner);
    table::add(&mut state.users,owner,object::id_to_address(&id));
    event::emit(ProfileCreate{
        id,
        owner,
    })
}

#[test_only]
public fun init_for_testing(ctx:&mut TxContext){
    init(ctx)
}

public fun withdraw_coin_from_manager<T0>(arg0: &mut VaultManager, arg1: 0x2::object::ID, arg2: u64, arg3: &mut 0x2::tx_context::TxContext) {
    withdraw_coin<T0>(0x2::object_table::borrow_mut<0x2::object::ID, Vault>(&mut arg0.vaults, arg1), arg2, arg3);
}


public fun withdraw_coin<T0>(arg0: &mut Vault, arg1: u64, arg2: &mut 0x2::tx_context::TxContext) {
    assert_sender_is_vault_creator(arg2, arg0);
    let v0 = 0x2::object_bag::remove<u64, 0x2::coin::Coin<T0>>(&mut arg0.contents, arg1);
    let v1 = CoinWithdrawnEvent<T0>{
        vault_id   : 0x2::object::id<Vault>(arg0),
        index      : arg1,
        coin_value : 0x2::coin::value<T0>(&v0),
    };
    0x2::event::emit<CoinWithdrawnEvent<T0>>(v1);
    0x2::transfer::public_transfer<0x2::coin::Coin<T0>>(v0, arg0.creator);
}

fun assert_sender_is_vault_creator(arg0: &0x2::tx_context::TxContext, arg1: &Vault) {
    assert!(sender_is_vault_creator(arg0, arg1), 9223372522186211331);
}

fun sender_is_vault_creator(arg0: &0x2::tx_context::TxContext, arg1: &Vault) : bool {
    0x2::tx_context::sender(arg0) == arg1.creator
}


