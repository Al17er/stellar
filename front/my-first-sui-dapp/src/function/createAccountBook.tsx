import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { networkConfig, suiClient } from "../config/networkConfig";

const CreateAccountBook: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = networkConfig.testnet.packageID;
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');

    const create = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }

        try {
            setLoading(true);

            const state = await suiClient.getObject({
                id: networkConfig.testnet.stateID,
                options: { showContent: true }
            }) as any;
            const state_fields_id = state.data.content.fields.users.fields.id['id'];

            const state_field = await suiClient.getDynamicFields({
                parentId: state_fields_id,
            }) as any;

            const foundItem = state_field.data.find((item: { name: { value: string | undefined; }; }) => item.name.value === currentAccount?.address);
            const profile_id_dynamicFields = foundItem ? foundItem.objectId : null;

            const profield_field = await suiClient.getObject({
                id: profile_id_dynamicFields,
                options: { showContent: true }
            }) as any;

            const profield = profield_field.data.content.fields.value;

            const tx = new Transaction();
            tx.setGasBudget(10000000);

            tx.moveCall({
                package: PackageId,
                module: "stellar",
                function: "Account_Book_create",
                arguments: [
                    tx.object(profield),
                    tx.pure.string(category), // 使用状态变量中的category值
                    tx.object(networkConfig.testnet.booksID),
                ],
            });

            const result = await signAndExecute({ transaction: tx });

            if (result && !isError) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error creating account book:", error);
        } finally {
            setLoading(false); // 确保加载状态在请求完成后被重置
        }
    };

    // 定义样式
    const inputStyle = {
        padding: '10px',
        marginRight: '10px',
        border: '2px solid #ccc',
        borderRadius: '5px',
        fontSize: '16px',
        transition: 'border-color 0.3s ease',
        outline: 'none',
        boxShadow: category ? '0 0 0 2px lightblue' : 'none', // 输入内容时增加边框高亮
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: 'white',
        color: 'black',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        opacity: (!category || loading) ? 0.6 : 1, // 当按钮不可用时降低透明度
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)} // 绑定输入事件
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'blue'} // 获得焦点时改变边框颜色
                onBlur={(e) => e.target.style.borderColor = category ? '#ccc' : '#ccc'} // 失去焦点时恢复边框颜色
            />
            <button
                onClick={create}
                style={buttonStyle}
                disabled={!category || loading} // 禁用按钮直到输入了category且不在加载状态
            >
                {loading ? 'Loading...' : '创建账本'}
            </button>
        </div>
    );
};

export default CreateAccountBook;