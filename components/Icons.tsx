import {
    Mail,
    Facebook,
    Instagram,
    MessageCircle,
    Globe,
    FileText,
    Link,
    type Icon as LucideIcon,
} from "lucide-react";

export type Icon = typeof LucideIcon;

export const Icons = {
    mail: Mail,
    facebook: Facebook,
    instagram: Instagram,
    wechat: MessageCircle,
    blog: Globe,
    fileText: FileText,
    link: Link,
};
