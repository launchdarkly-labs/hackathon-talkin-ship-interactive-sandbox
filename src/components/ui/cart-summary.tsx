"use client"
import React, { useState, useEffect } from 'react'
import { useShoppingCart } from 'use-shopping-cart'
import * as Separator from '@radix-ui/react-separator';
import { styled } from '@stitches/react';
import { blueDark, grass, slate } from '@radix-ui/colors';
import { AiOutlineShopping } from 'react-icons/ai';
import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";
import { v4 as uuidv4 } from 'uuid';
import { setCookie, getCookie } from "cookies-next";


// const inter = Inter({ subsets: ['latin'] });

const CartSummary = () => {
  const { checkout } = useFlags();
  const user = getCookie("ldcontext");
  const checkoutTrue = getCookie("checkoutTrue");
  console.log('user in cart -> ', user);
  console.log('checkout in cart -> ', checkout);
  const [loading, setLoading] = useState(false)
  const [cartEmpty, setCartEmpty] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const {
    formattedTotalPrice,
    cartCount,
    clearCart,
    cartDetails,
  } = useShoppingCart()
  const client = useLDClient();

  useEffect(() => setCartEmpty(!cartCount), [cartCount])

  const handleCheckout  = async (event: React.FormEvent) => {

    event.preventDefault();
    // setLoading(true)
    // setErrorMessage('')
    // const body = { cartDetails };
    

    for (let i = 0; i < 20000; i++) {
      
      if (client) {
        let context: any = await client?.getContext();
        context.user.key = uuidv4();
        context.user.anonymous = false;
        await client.identify(context);
        console.log('user key -> ', context.user.key); 
        let variation = client?.variation("checkout", false);
  
        let probarbility = Math.random() * 100;
        console.log('probarbility -> ', probarbility);
        if(variation) {
          if(probarbility < 99) {
            console.log('checkout error on true');
            await client?.track("error-count");
            await client?.flush();
          }
        }
        else {
          if(probarbility < 1) {
            console.log('checkout error on false');
            await client?.track("error-count");
            await client?.flush();
          }
        }
        await new Promise(resolve => setTimeout(resolve, 5));
      }
    }

    }
  return (
    <Box css={{ width: "100%", maxWidth: 600, margin: "0 15px" }}>
      <form>
        <h1 style={{ display: "flex", verticalAlign: "middle" }}>
          <AiOutlineShopping style={{ height: "30px", width: "30px" }} />
          Cart
        </h1>
        <SeparatorRoot css={{ margin: "15px 0" }} />
        {errorMessage ? (
          <p style={{ color: "red" }}>Error: {errorMessage}</p>
        ) : null}
        {/* This is where we'll render our cart */}
        <h3 suppressHydrationWarning>
          <strong>Number of Items:</strong> {cartCount}
        </h3>
      {/* Redirects the user to Stripe */}
      <Button
        variant={checkoutTrue ? 'red' : 'green'}
        className="cart-style-background"
        type="submit"
        css={{marginRight: 25}}
        onClick={handleCheckout}
      >
        Checkout
      </Button>
      <Button
        variant='blue'
        className="cart-style-background"
        type="button"
        onClick={clearCart}
      >
        Clear Cart
      </Button>
    </form>
    </Box>
  );
}

//styling for the cart 
const SeparatorRoot = styled(Separator.Root, {
  backgroundColor: slate.slate7,
  '&[data-orientation=horizontal]': { height: 1, width: '100%' },
  '&[data-orientation=vertical]': { height: '100%', width: 1 },
});

const Box = styled('div', {});

const Button = styled('button', {
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 4,
  padding: '0 15px',
  fontSize: 15,
  //fontFamily: "inter",,
  lineHeight: 1,
  fontWeight: 500,
  height: 35,

  variants: {
    variant: {
      blue: {
        backgroundColor: 'white',
        color: blueDark.blue1,
        '&:hover': { backgroundColor: slate.slate7 },
      },
      green: {
        backgroundColor: grass.grass4,
        color: grass.grass11,
        '&:hover': { backgroundColor: grass.grass5 },
        '&:focus': { boxShadow: `0 0 0 2px ${grass.grass7}` }
      },
      red: {
        backgroundColor: 'red',
        color: 'white',
        '&:hover': { backgroundColor: 'darkred' },
      }
    },
  },

  defaultVariants: {
    variant: 'blue',
  },
})

export default CartSummary