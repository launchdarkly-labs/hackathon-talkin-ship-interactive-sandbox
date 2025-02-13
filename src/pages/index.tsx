import Head from "next/head";
import styles from "@/styles/Home.module.css";
import NavigationMenuDemo from "@/components/menu";
import StoreLaunch from "@/components/storelaunch";
import { cn } from "@/lib/utils";
import { useFlags, useLDClient } from "launchdarkly-react-client-sdk";
import { v4 as uuidv4 } from "uuid";
import { setCookie, getCookie } from "cookies-next";
import { useEffect } from "react";



export default function Home() {

  const client = useLDClient();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (client) {
        setCookie("checkoutTrue", false);
        let context: any = await client?.getContext();
        context.user.key = uuidv4();
        context.user.anonymous = false; 
        setCookie("ldcontext", context);
        
        client.identify(context);
        let checkout = await client?.variation("checkout", false);   

        if (checkout) {
          setCookie("ldcontext", context);
          setCookie("checkoutTrue", true);
          clearInterval(interval);
        }
      }
    }, 100);
  
    return () => clearInterval(interval); // Cleanup on unmount
  }, [client]);


  return (
    <div className={cn("font-sohne")}>
      <Head>
        <title>Toggle Outfitters</title>
      </Head>
      <div className="min-h-screen bg-black">
        <header className={`fixed z-50 ${styles.header}`}>
          <NavigationMenuDemo />
        </header>
        <StoreLaunch />
      </div>
    </div>
  );
}
