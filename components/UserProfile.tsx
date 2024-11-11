'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from '@/components/Icons';

interface UserInfo {
    avatar: string | null;
    nickname: string;
    name: string;
    uniquenName: string;
    introduction: string | null;
    tags: string[];
    layout: Array<{
        id: string | null;
        itemType: string | null;
        title: string;
        type: string;
        value: Array<{ field: string; value: string | null; component: string }> | null;
        items: Array<any> | null;
    }>;
}

export function UserProfile({ username }: { username: string }) {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`/api/user/${username}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserInfo();
    }, [username]);

    if (!userInfo) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="w-full max-w-7xl p-4 lg:flex lg:gap-8">
            <div className="lg:w-1/3 mb-8 lg:mb-0">
                <div className="sticky top-4">
                    <Avatar className="w-32 h-32 md:w-48 md:h-48 mb-4 mx-auto lg:mx-0">
                        <AvatarImage src={userInfo.avatar || ''} alt={userInfo.nickname} />
                        <AvatarFallback>{userInfo.nickname.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl font-bold mb-2">{userInfo.nickname}</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{userInfo.introduction || ''}</p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                            {userInfo.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userInfo.layout.map((item, index) => (
                        <LayoutItem key={index} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function LayoutItem({ title, type, value, items }: UserInfo['layout'][0]) {
    if (type === 'group' && items) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {items.map((subItem, index) => (
                        <div key={index} className="mb-2">
                            <strong>{subItem.title}:</strong> {subItem.value}
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (value && value.length > 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {value.map((val, index) => (
                        <div key={index}>
                            {val.component === 'url' ? (
                                <Button variant="ghost" className="w-full justify-start p-0" asChild>
                                    <a href={val.value || '#'} target="_blank" rel="noopener noreferrer">
                                        Visit {title}
                                    </a>
                                </Button>
                            ) : (
                                <p>{val.value}</p>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    return null;
}
