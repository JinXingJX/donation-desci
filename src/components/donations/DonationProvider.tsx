import { createContext, useContext, ReactNode } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Program, AnchorProvider } from "@coral-xyz/anchor";
import { IDL } from "../../../anchor/target/idl/donation_program.json";

interface DonationContextType {
  program: Program;
  initialized: boolean;
}

const DonationContext = createContext<DonationContextType | null>(null);

export function DonationProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = new AnchorProvider(connection, wallet as any, {
    commitment: "processed",
  });

  const program = new Program(
    IDL,
    process.env.NEXT_PUBLIC_PROGRAM_ID!,
    provider,
  );

  return (
    <DonationContext.Provider value={{ program, initialized: true }}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonationProgram() {
  const context = useContext(DonationContext);
  if (!context) {
    throw new Error("useDonationProgram must be used within DonationProvider");
  }
  return context;
}
