import { useEffect, useState } from 'react';
import Link from 'next/link';
import Hamburger from 'hamburger-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import style from './style.module.css';

/**
 * Drawer container
 * 
 * @param {*} param0 
 */
export default function DrawerContainer({ children }) {

  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Ensure page is still scrollable after unloaded
  useEffect(() => {
    return () => {
      window.onscroll = function () { };
    }
  }, []);

  /**
   * Toggles drawer and background
   * 
   * @param {*} v 
   */
  const toggle = v => {
    if (v) {
      // https://www.geeksforgeeks.org/how-to-disable-scrolling-temporarily-using-javascript/
      // Get the current page scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // Freeze scroll
      window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
      };

      setIsOpen(v);
    } else {
      // Enable scroll
      window.onscroll = function () { };

      setIsClosing(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsClosing(false);
      }, 200);
    };
  }

  return (
    <div>
      <div className="fixed rounded-br-full pl-2 pt-2 pr-5 pb-5 bg-yellow-300 shadow-xl z-50">
        <div className={style['page-hamburger']}>
          <Hamburger toggled={isOpen} toggle={toggle} />
        </div>
      </div>

      <div className={
        isOpen
          ? isClosing
            ? `${style['drawer']} animate__animated animate__slideOutLeft`
            : `${style['drawer']} animate__animated animate__slideInLeft`
          : `${style['hidden-drawer']}`
      }>
        <div className="flex justify-end items-center m-3">
          {/* Using fontawesome for now since mobile has trouble hiding hamburger */}
          <FontAwesomeIcon icon={faTimes} style={{ cursor: 'pointer' }} onClick={() => toggle(false)} size="2x" />
        </div>
        <div className="flex flex-col items-center m-5">
          <div className={style['drawer-item']}>
            <Link href="/"><a>Home</a></Link>
          </div>
          <div className={style['drawer-item']}>
            <Link href="/docs/Jason Maa - Resume.pdf"><a>Resume</a></Link>
          </div>
          <div className={style['drawer-item']}>
            <Link href="/blog"><a>Blog</a></Link>
          </div>
        </div>
      </div>

      <div className={
        isOpen
          ? isClosing
            ? `${style['faded-bg']} animate__animated animate__fadeOut`
            : `${style['faded-bg']} animate__animated animate__fadeIn`
          : ''
      } onClick={() => {
        if (isOpen) {
          toggle(false);
        }
      }}
      ></div>

      { children}
    </div >
  );
}