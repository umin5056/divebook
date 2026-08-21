import { Popup, Page, Navbar, Block } from "konsta/react";
import { X } from "lucide-react";

export default function PolicyModal({ opened, onClose, title, children }) {
  return (
    <Popup opened={opened} onBackdropClick={onClose}>
      <Page>
        <Navbar
          title={title}
          right={<X onClick={onClose} className="cursor-pointer" />}
        />
        <Block strong className="whitespace-pre-line text-sm leading-relaxed">
          {children}
        </Block>
      </Page>
    </Popup>
  );
}
