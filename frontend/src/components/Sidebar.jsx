import styles from '@styles/components/sidebar.module.css';
import hat from '@assets/images/logos/hat.svg';
import logo from '@assets/images/logos/logo.svg';
import sidebar from '@assets/images/icons/sidebar.svg';
import play from '@assets/images/icons/play.svg';
import leaderboard from '@assets/images/icons/leaderboard.svg';
import heart from '@assets/images/icons/heart.svg';

const Sidebar = () => {
  return (
    <nav id={styles.sidebar}>
        <div id={styles.header}>
            <div id={styles.logo_container}>
                <img id={styles.hat} src={hat} alt="hat" />
                <img id={styles.logo} src={logo} alt="logo" />
                <h1>404cast</h1>
            </div>
            <img id={styles.sidebar_toggle} src={sidebar} alt="sidebar" />
        </div>

        {/* <div id={styles.actions}>
            <div className={styles.action}>
                <img src={play} alt="Play icon"/>
                
            </div>
            <div className={styles.action}>
                <img src={play} alt="Play icon"/>
            </div>
        </div>

        <div id={styles.game_progress}>

        </div>

        <footer>

        </footer> */}
    </nav>
  );
};

export default Sidebar;
