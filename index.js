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
            type: "input",
            name: 'accountName',
            message: "Qual nome que você quer dar a sua Conta?"
        }
    ]).then((res) => {
        console.log(chalk.bgGreen.black('Obrigado por escolher o nosso banco!'))
        const accountName = res.accountName
     
        if(!fs.existsSync('Accounts')) {
            fs.mkdirSync('Accounts')
        } 

        if(fs.existsSync(`./Accounts/${accountName}.txt`)) {
            console.log(chalk.bgRed('A conta já existe, escolha outro nome'))
            return;

        } 

        fs.writeFileSync(`./Accounts/${accountName}.txt`, '0', (err) => {
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
            console.log(chalk.bgRed('A conta não existe'))
            operation();
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

const depositCash = () => {

    const validateNumber = async (input) => {
        if (!Number(input)) {
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
        }
    ]).then(res => {
        const accountName = res.accountName
        const accountCash = +res.accountCash

        if(!fs.existsSync(`./Accounts/${accountName}.txt`)) {
            console.log(chalk.bgRed('A conta não existe'))
            operation();
            return;
        }

        fs.readFile(`./Accounts/${accountName}.txt`, 'utf-8', (err, data) => {
            if (err) {
                console.log(`${err} Erro!! `)
            }

            const soma = `${accountCash + +data}`
            fs.writeFile(`./Accounts/${accountName}.txt`, soma, (err, data) => {
                if (err) {
                    console.log(chalk.bgRed(`Erro ao depositar`))
                }
                console.log(chalk.bgGreenBright(`Você depositou R$${accountCash}!`))
            })


        })
    }).catch(err => {
        console.log(err)
    })
}


const withdraw = () => {
    inquirer.prompt([
        {
            name: "accountName",
            message: "Qual nome da sua conta?",
            type: "input"
        },
        {
            name: "accountCash",
            message: "Quanto você quer sacar?",
            type: "input"
        }
    ]).then(res => {

        const accountName = res.accountName
        const accountCash = parseInt(res.accountCash)

        if(!fs.existsSync(`./Accounts/${accountName}.txt`)) {
            console.log(chalk.bgRedBright('A conta não existe'))
        }

        fs.readFile(`./Accounts/${accountName}.txt`, 'utf-8', (err, data) => {
            if(err) {
                console.log(chalk.bgRedBright('Erro ao acessar conta'))
                return;
            }

            if(data < accountCash) {
                console.log(chalk.bgRedBright('O valor é maior que o solicitado'))
                operation();

            } else {
                const sub = `${parseInt(data) - accountCash}`
                fs.writeFile(`./Accounts/${accountName}.txt`, sub, (err, data) => {
                    if (err) {
                        console.log(chalk.bgRedBright('Erro ao Sacar conta'))
                    }

                    console.log(chalk.bgGreenBright(`Você sacou  R$${accountCash} e agora sua conta possui R$${sub}`))
                    operation();
                })
            }
        })
    })
}