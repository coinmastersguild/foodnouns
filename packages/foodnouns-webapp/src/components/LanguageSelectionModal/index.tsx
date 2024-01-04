import Modal from '../Modal';
import classes from './LanguageSelectionModal.module.css';
import i18n from 'i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { useActiveLocale } from '../../hooks/useActivateLocale';

interface Languages {
  en: Language;
  jp: Language;
  es: Language;
}

interface Language {
  nativeName: string;
}

interface LanguageSelectionModalProps {
  onDismiss: () => void;
}

const SUPPORTED_LNG: Languages = {
  en: {
    nativeName: 'English',
  },
  jp: {
    nativeName: '日本語',
  },
  es: {
    nativeName: 'Español',
  },
};

/**
 * Note: This is only used on mobile. On desktop, language is selected via a dropdown.
 */
const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = props => {
  const { onDismiss } = props;
  const activeLocale = useActiveLocale();

  const modalContent = (
    <div className={classes.LanguageSelectionModal}>
      {Object.keys(SUPPORTED_LNG).map((lng: string) => {
        return (
          <div
            className={classes.languageButton}
            key={lng}
            onClick={() => {
              void i18n.changeLanguage(lng);
              onDismiss();
            }}
          >
            {SUPPORTED_LNG[lng as keyof Languages].nativeName}
            {lng === activeLocale && (
              <FontAwesomeIcon height={24} width={24} className={classes.icon}  icon={faCheck} />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <Modal title={<p>Select Language</p>} content={modalContent} onDismiss={onDismiss} />
  );
};
export default LanguageSelectionModal;
