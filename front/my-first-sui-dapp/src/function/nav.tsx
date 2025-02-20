import React, { Component } from 'react';
import CreateProfile from "./createProfile.tsx";
import CreateAccountBook from "./createAccountBook.tsx";
import AddContent from "./createContent.tsx";
import { Box, Flex } from "@radix-ui/themes";

class Nav extends Component {
    constructor(props:any) {
        super(props);
        this.state = { activeModule: 'CreateProfile' }; // 初始激活模块
    }

    render() {
        const { activeModule } = this.state;
        return (
            <Box style={{ background: "black", padding: "20px" }}>
                {/* 导航栏 */}
                <Flex direction="column">
                    <Flex gap="3" mb="5" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <button
                                onClick={() => this.setState({ activeModule: 'CreateProfile' })}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: activeModule === 'CreateProfile' ? 'blue' : 'white',
                                    color: activeModule === 'CreateProfile' ? 'white' : 'black',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    marginRight: '10px',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onMouseEnter={e => e.target.style.backgroundColor = '#d3d3d3'}
                                onMouseLeave={e => e.target.style.backgroundColor = activeModule === 'CreateProfile' ? 'green' : 'white'}
                            >
                                创建用户
                            </button>
                            <button
                                onClick={() => this.setState({ activeModule: 'CreateAccountBook' })}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: activeModule === 'CreateAccountBook' ? 'green' : 'white',
                                    color: activeModule === 'CreateAccountBook' ? 'white' : 'black',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    marginRight: '10px',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onMouseEnter={e => e.target.style.backgroundColor = '#d3d3d3'}
                                onMouseLeave={e => e.target.style.backgroundColor = activeModule === 'CreateAccountBook' ? 'green' : 'white'}
                            >
                                创建账本
                            </button>
                            <button
                                onClick={() => this.setState({ activeModule: 'AddContent' })}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: activeModule === 'AddContent' ? 'green' : 'white',
                                    color: activeModule === 'AddContent' ? 'white' : 'black',
                                    border: 'none',
                                    padding: '10px 20px',
                                    borderRadius: '5px',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onMouseEnter={e => e.target.style.backgroundColor = '#d3d3d3'}
                                onMouseLeave={e => e.target.style.backgroundColor = activeModule === 'AddContent' ? 'green' : 'white'}
                            >
                                记账
                            </button>
                        </div>
                    </Flex>

                    {/* 根据当前活动模块渲染相应的组件 */}
                    {activeModule === 'CreateProfile' && <CreateProfile onSuccess={() => alert("Create Profile")} />}
                    {activeModule === 'CreateAccountBook' && <CreateAccountBook onSuccess={() => alert("Create AccountBook")} />}
                    {activeModule === 'AddContent' && <AddContent onSuccess={() => alert("Add Content")} />}
                </Flex>
            </Box>
        );
    }
}

export default Nav;