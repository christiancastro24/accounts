// Modulos externos
import chalk from "chalk"
import inquirer from 'inquirer';

// modulos internos
import fs from 'fs';


// Operation
const operation = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "O que você deseja fazer?",
            choices: [
                'Criar Conta',
                'Consultar Saldo',
                'Depositar',
                'Sacar',
                'Transferencia',
                'Remover Conta',
                'Sair'
            ]
        }
    ]).then(res => {

        const action = res.action
        
        if (action === "Criar Conta") {
            buildAccount();

        } else if(action === "Consultar Saldo") {
            consultBalance();
        } 

        else if(action === "Depositar") {
            depositCash();
        }

        else if(action === "Sacar") {
            withdraw();

        } else if(action === "Transferencia") {
            transferCash();          

        } else if(action === "Remover Conta") {
            removeAccount();          

        } else {
            console.log(chalk.bgBlue('Você encerrou sua sessão.'));
            setTimeout(() => {
                console.clear();
                process.exit();
            }, 1200)
        }
    }).catch(err => console.log(err))
}

operation()

// Criar Conta
const buildAccount = () => {
    inquirer.prompt([
        {
            name: 'accountName',
            message: "Qual nome que você quer dar a sua Conta?",
            type: "input",
        }
    ]).then((res) => {
        const accountName = res.accountName
     
        if(!fs.existsSync('Accounts')) {
            fs.mkdirSync('Accounts')
            console.log(chalk.bgGreen.black('Obrigado por escolher o nosso banco!'))
        } 

        if(fs.existsSync(`./Accounts/${accountName}.txt`)) {
            console.log(chalk.bgRed('Esta conta já existe, escolha outro nome'))
            operation();
            return;

        } 

        fs.writeFileSync(`./Accounts/${accountName}.txt`, '10', (err) => {
            console.log(err)
        })

        console.log(chalk.bgGreen.bold('Sucesso ao criar conta'))
        operation();
        
    }).catch(err => {        
        console.log(err)
    })
}

// Consulta de Saldo
const consultBalance = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Qual nome da sua conta?",
            name: "accountName"
        }
    ]).then(res => {

        const accountName = res.accountName

        if(!fs.existsSync(`./Accounts/${accountName}.txt`)) {
            console.log(chalk.bgRed('A conta não existe, por favor verifique o que foi digitado.'))
            consultBalance();
        }

        fs.readFile(`./Accounts/${accountName}.txt`, 'UTF-8', (err, data) => {
            const translateToNumber = +data
            if (data) {
                console.log(chalk.bgGreenBright(`Sua conta possui R$${translateToNumber}`))
                operation();
            }
        })


    }).catch(err => {
        console.log(err)
    })
}

// Deposito
const depositCash = () => {

    const validateNumber = async (input) => {
        if (!Number(input) || !input) {
            return 'O valor deve ser número'
        }
        return true
    }   

    inquirer.prompt([     
         {
            type: "input",
            message: "Qual nome da sua conta?",
            name: "accountName"
        },

        {
            type: "input",
            message: "Quanto você deseja depositar?",
            name: "accountCash",
            validate: validateNumber
        },
        {
            message: "Confirmar(Y) - Cancelar(n)",
            type: "confirm",
            name: "cancelRequest"
        },
    ]).then(res => {

        const accountName = res.accountName
        const accountCash = +res.accountCash
        const cancelRequest = res.cancelRequest

        if(!cancelRequest) {
            console.log(chalk.bgBlue('Você encerrou sua sessão.'));
            setTimeout(() => {
                console.clear();
                process.exit();
            }, 1200)
            return;
        }

        if(!fs.existsSync(`./Accounts/${accountName}.txt`)) {
            console.log(chalk.bgRed('A conta não existe, por favor verifique o que foi digitado.'))
            depositCash();
            return;
        }

        fs.readFile(`./Accounts/${accountName}.txt`, 'utf-8', (err, data) => {
            if (err) {
                console.log(`${err} Erro!! `)
                depositCash();
            }

            const soma = `${accountCash + +data}`
            fs.writeFile(`./Accounts/${accountName}.txt`, soma, (err) => {
                if (err) {
                    console.log(chalk.bgRed(`Erro ao depositar`))
                    depositCash();

                }
                console.log(chalk.bgGreenBright(`Você depositou R$${accountCash}!`))
                operation();

            })


        })
    }).catch(err => {
        console.log(err)
    })
}


// Saque
const withdraw = () => {

    const validateNumber = async (input) => {
        if (!Number(input)) {
            return 'O valor deve ser número'
        }
        return true
    }   

    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual nome da sua conta?",
            type: "input"
        },
        {
            name: "accountCash",
            message: "Quanto você deseja sacar?",
            type: "input",
            validate: validateNumber
        },
        {
            message: "Confirmar(Y) - Cancelar(n)",
            type: "confirm",
            name: "cancelRequest"
        }
    ]).then(res => {

        const accountName = res.accountName
        const accountCash = parseInt(res.accountCash)
        const cancelRequest = res.cancelRequest

        if(!cancelRequest) {
            console.log(chalk.bgBlue('Você encerrou sua sessão.'));
            setTimeout(() => {
                console.clear();
                process.exit();
            }, 1200)
            return;
        }

        if(!fs.existsSync(`./Accounts/${accountName}.txt`)) {
            console.log(chalk.bgRedBright.white('A conta não existe, por favor verifique o que foi digitado.'))
            withdraw();
            return;
        }

        fs.readFile(`./Accounts/${accountName}.txt`, 'utf-8', (err, data) => {

            if(data < accountCash) {
                console.log(chalk.bgRedBright('O valor solicitado é maior que você possui na conta!'))
                withdraw();

            } else {
                const sub = `${parseInt(data) - accountCash}`
                fs.writeFile(`./Accounts/${accountName}.txt`, sub, (err) => {
                    if (err) {
                        console.log(chalk.bgRedBright('Erro ao Sacar conta'))
                    }

                    console.log(chalk.bgGreenBright(`Você sacou  R$${accountCash} e agora sua conta possui R$${sub}`))
                    operation();
                })
            }
        })
    }).catch(err => {
        console.log(err)
    })
}

// Transferência
const transferCash = () => {
    const validateNumber = async (input) => {
        if (!Number(input)) {
            return 'O valor deve ser número'
        }
        return true
    }   
    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual nome da sua conta?",
            type: "input"
        },
        {
            name: "accountTransfer",
            message: "Para qual conta você deseja transferir?",
            type: "input"
        },
        {
            name: "accountCash",
            message: "Qual valor você deseja transferir?",
            type: "input",
            validate: validateNumber
        },
        {
            message: "Confirmar(Y) - Cancelar(n)",
            type: "confirm",
            name: "cancelRequest"
        },
    ]).then(res => {

        const accountName = res.accountName
        const accountTransfer = res.accountTransfer
        const accountCash = res.accountCash
        const cancelRequest = res.cancelRequest

        if(!cancelRequest) {
            console.log(chalk.bgBlue('Você encerrou sua sessão.'));
            setTimeout(() => {
                console.clear();
                process.exit();
            }, 1200)
            return;
        }

        if(!fs.existsSync(`./Accounts/${accountName}.txt`)) {
            console.log(chalk.bgRedBright.white('A conta não existe, por favor verifique o que foi digitado.'))
            transferCash();
            return;
        }

        // Vendo se a conta que quer receber transferência existe
        if(!fs.existsSync(`./Accounts/${accountTransfer}.txt`)) {
            console.log(chalk.bgRedBright.white('A conta que você quer transferir não existe, por favor verifique o que foi digitado.'))
            transferCash();
            return;
        }

        fs.readFile(`./Accounts/${accountName}.txt`, (err, data) => {
            if(data < accountCash) {
                console.log(chalk.bgRedBright.white('O valor solicitado é maior que você possui na conta!'))
                transferCash();
                return;
            } else {   
                const sub = `${parseInt(data) - parseInt(accountCash)}`
                fs.writeFile(`./Accounts/${accountName}.txt`, sub, (err) => {
                })   
                
                fs.readFile(`./Accounts/${accountTransfer}.txt`, (err, data) => {
                    const plus = `${(parseInt(data) + parseInt(accountCash))}`
                    fs.writeFile(`./Accounts/${accountTransfer}.txt`, plus, (err) => {
                        console.log(chalk.greenBright(`Transferencia no valor de R$${accountCash} realizada!`))
                        operation();
                    })    
                })
            }           
        })

    }).catch(err => {
        console.log(err)
    })
}


// Remover Conta
const removeAccount = () => {
    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual nome da sua conta?",
            type: "input"
        },
        {
            name: "removeAccountUser",
            message: "Deseja remover conta?",
            type: "confirm"
        },
        {
            message: "Confirmar(Y) - Cancelar(n)",
            type: "confirm",
            name: "cancelRequest"
        },
    ]).then(res => {
        const accountName = res['accountName']
        const removeAccountUser = res['removeAccountUser']

        const cancelRequest = res.cancelRequest

        if(!cancelRequest) {
            console.log(chalk.bgBlue('Você encerrou sua sessão.'));
            setTimeout(() => {
                console.clear();
                process.exit();
            }, 1200)
            return;
        }

        if(!fs.existsSync(`./Accounts/${accountName}.txt`)) {
            console.log(chalk.bgRed('A conta não existe, por favor verifique o que foi digitado.'))
            removeAccount();
            return;
        }

        if (removeAccountUser) {
            fs.unlink(`./Accounts/${accountName}.txt`, (err) => {
                if (err) {
                    console.log(chalk.bgRed('Erro ao remover conta! Tente novamente'))
                    removeAccount();
                    return;

                } else {
                    console.log(chalk.bgBlueBright(`Sucesso ao remover conta!`))
                    operation();             
                }
            })

        }
    })
}