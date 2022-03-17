import Image from 'next/image';
import styles from './Success.module.sass';
import successImage from '../../public/images/successful.png';

const Success = () => {
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <Image
          src={successImage}
          alt="Success image"
          width={104}
          height={104}
        />
        <h3>Thank you for checking in! Stay safe. 🙏 💛 💙</h3>
      </div>
    </div>
  );
};

export default Success;
