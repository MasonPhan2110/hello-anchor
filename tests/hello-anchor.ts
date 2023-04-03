import * as anchor from "@project-serum/anchor";
import { Program } from '@project-serum/anchor';
import {HelloAnchor} from "../target/types/hello_anchor";
const assert = require("assert");

const { SystemProgram } = anchor.web3;

describe("Hello Anchor", () => {
    const provider = anchor.Provider.local()
    anchor.setProvider(provider)
    const program = anchor.workspace.HelloAnchor  as Program<HelloAnchor>;;
    let _myAccount

    it("Creates and initializes an account in a single atomic transaction (simplified)", async () => {
        
        // The Account to create
        const myAccount = anchor.web3.Keypair.generate();

        // Create the new account and initialize it with the program.
        await program.rpc.initialize(new anchor.BN(1234),{
            accounts: {
                myAccount: myAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [myAccount]
        });

        // Fetch the newly created account from the cluster.
        const account = await program.account.myAccount.fetch(myAccount.publicKey);
        // Check it's state was initialized.
        assert.ok(account.data.eq(new anchor.BN(1234)));

        // Store the account for the next test.
        _myAccount = myAccount;
    })
    it("Update a previously created account", async () => {
        await program.rpc.update(new anchor.BN(2345), {
            accounts: {
                myAccount: _myAccount.publicKey
            }
        });
        // Fetch the newly created account from the cluster.
        const account = await program.account.myAccount.fetch(_myAccount.publicKey);
        // Check it's state was initialized.
        assert.ok(account.data.eq(new anchor.BN(2345)));
    })
})