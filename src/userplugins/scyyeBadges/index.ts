/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { BadgePosition, BadgeUserArgs, ProfileBadge } from "@api/Badges";
import { Badges } from "@api/index";
import definePlugin from "@utils/types";
import { GuildMemberStore, GuildStore, UserStore } from "@webpack/common";
import { User } from "discord-types/general/index.js";
import React from "react";

let registered: ProfileBadge[] = [];


interface ScyyeBadge {
    image: string;
    shouldShow(info: BadgeUserArgs): boolean;
}

function badge(key: string, badge: ScyyeBadge, position: BadgePosition = BadgePosition.START, link: string = "",
    onClick: () => void = () => {}) {
    const b: ProfileBadge = new class implements ProfileBadge {
        component: React.ComponentType<ProfileBadge & BadgeUserArgs> | undefined;
        description: string | undefined;
        image: string | undefined;
        key: string | undefined;
        link: string | undefined;
        position: BadgePosition | undefined;
        props: React.HTMLProps<HTMLImageElement> | undefined;

        onClick(): void {
            onClick();
        }

        shouldShow(userInfo: BadgeUserArgs): boolean {
            return badge.shouldShow(userInfo);
        }
    };

    b.key = key;
    b.image = badge.image;
    b.description = format(key);
    b.link = link;
    b.position = position;

    Badges.addBadge(badge);
    registered.push(badge);
}

function format(id: string) {
    let result = "";
    let startOfWord = true;
    for (const c of id) {
        if (c === "_") {
            startOfWord = true;
            result += " ";
        } else if (startOfWord) {
            result += c.toUpperCase();
            startOfWord = false;
        } else {
            result += c;
        }
    }
    console.log(result, id);
    return result;
}

export default definePlugin({
    name: "Scyye Badges",
    description: "A set of badges by scyye",
    authors: [{ id: 553652308295155723n, name: "Scyye" }],
    start() {
        addScyyeBadges();
    },
    stop() {
        removeScyyeBadges();
    }
});

function removeScyyeBadges() {
    registered.forEach(b => {
        Badges.removeBadge(b);
    });
    registered = [];
}

function addScyyeBadges() {
    badge("scyye", {
        image: "https://i.imgur.com/u8fTrP9.png",
        shouldShow(userInfo: BadgeUserArgs): boolean {
            return userInfo.userId==="553652308295155723";
        }
    });
    badge("in_my_DM_server", {
        image: GuildStore.getGuild("1116093904266211358").getIconURL(500, true),
        shouldShow(userInfo: BadgeUserArgs): boolean {
            return GuildMemberStore.isMember("1116093904266211358", userInfo.userId);
        }
    });
    badge("root", {
        image: UserStore.getUser("318902553024659456").getAvatarURL(),
        shouldShow(userInfo: BadgeUserArgs): boolean {
            const user: User = UserStore.getUser(userInfo.userId);
            return (user.globalName??user.username).includes("』");
        }
    });
    badge("card_creator", {
        image: "https://cdn.discordapp.com/role-icons/945402769525858355/e95ef5364010c2ff97e3dcce45b9aa80.webp?size=24&quality=lossless",
        shouldShow(userInfo: BadgeUserArgs): boolean {
            return GuildMemberStore.isMember("844974450927730738", userInfo.userId)
            && GuildMemberStore.getMember("844974450927730738", userInfo.userId).roles.includes("945402769525858355");
        }
    });
}

