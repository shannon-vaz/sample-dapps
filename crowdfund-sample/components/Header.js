import React from "react";
import { Menu } from "semantic-ui-react";
import Link from "next/link";

const Header = function () {
  return (
    <Menu style={{ marginTop: '10px' }}>
      <Link href="/" passHref>
        <a className="item">CrowdCoin</a>
      </Link>

      <Menu.Menu position="right">
        <Link href="/" passHref>
          <a className="item">Campaigns</a>
        </Link>
        <Link href="/campaigns/new" passHref>
          <a className="item">+</a>
        </Link>
      </Menu.Menu>
    </Menu>
  );
};

export default Header;
