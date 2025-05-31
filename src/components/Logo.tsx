/**
 * @copyright 2024 mattxslv
 * @license Apache-2.0
 * @description Logo component for the app
 */

/**
 * Assets
 */
import { logo } from '@/assets';

const Logo = () => {
  return (
    <div className='flex items-center gap-3 font-semibold text-lg'>
      <img
        src={logo}
        alt='TaskBot AI'
        className='w-6 h-6'
      />
      TaskBot AI
    </div>
  );
};

export default Logo;
