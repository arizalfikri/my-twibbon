import { create } from "zustand";

export const useSubscriptionStore = create((set) => ({
    subscriptions: [],
    hasActiveContributor: false,
    hasActiveParticipant: false,
    isLoaded: false,

    setSubscriptions: (subscriptions) => {
        const hasActiveContributor = subscriptions?.some(
            (sub) => sub.status === "ACTIVE" && sub.plan?.type === "contributor"
        ) || false;

        const hasActiveParticipant = subscriptions?.some(
            (sub) => sub.status === "ACTIVE" && sub.plan?.type === "participant"
        ) || false;

        set({
            subscriptions,
            hasActiveContributor,
            hasActiveParticipant,
            isLoaded: true
        });
    },

    clearSubscriptions: () => set({
        subscriptions: [],
        hasActiveContributor: false,
        hasActiveParticipant: false,
        isLoaded: false
    }),
}));
