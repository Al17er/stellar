import React, { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { networkConfig } from "../config/networkConfig";

const CreateProfile: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute, isError } = useSignAndExecuteTransaction();
    const PackageId = networkConfig.testnet.packageID;
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');

    const create = async () => {
        if (!currentAccount?.address) {
            console.error("No connected account found.");
            return;
        }

        try {
            setLoading(true);

            const tx = new Transaction();
            tx.setGasBudget(10000000);

            tx.moveCall({
                package: PackageId,
                module: "stellar",
                function: "create_profile",
                arguments: [
                    tx.pure.string(userName), // 使用状态变量
                    tx.object(networkConfig.testnet.stateID),
                    tx.object(networkConfig.testnet.booksID),
                ],
            });

            const result = await signAndExecute({ transaction: tx });

            if (result && !isError) {
                onSuccess();
            }
        } catch (error) {
            console.error("Error creating profile:", error);
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
        boxShadow: userName ? '0 0 0 2px lightblue' : 'none', // 输入内容时增加边框高亮
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: 'white',
        color: 'black',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        opacity: (!userName || loading) ? 0.6 : 1, // 当按钮不可用时降低透明度
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)} // 绑定输入事件
                placeholder="Enter your username"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'blue'} // 获得焦点时改变边框颜色
                onBlur={(e) => e.target.style.borderColor = userName ? '#ccc' : '#ccc'} // 失去焦点时恢复边框颜色
            />
            <button
                onClick={create}
                style={buttonStyle}
                disabled={!userName || loading} // 禁用按钮直到输入了用户名且不在加载状态
            >
                {loading ? 'Loading...' : '创建用户'}
            </button>
        </div>
    );
};

export default CreateProfile;