import React from 'react';
import styles from '../styles/DesignedButton.module.css';

interface DesignedButtonProps {
    text: string;
}

const DesignedButton: React.FC<DesignedButtonProps> = ({ text }) => {
    return (
        <>
            <button className={styles.button}>
                <span></span>
                <span></span>
                <span></span>
                <span></span> { text }
            </button>
        </>
    );
};

export default DesignedButton;