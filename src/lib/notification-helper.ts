interface NotificationData {
  type:
    | "ATHLETE_ADDED"
    | "ATHLETE_UPDATED"
    | "ATHLETE_DELETED"
    | "INSURANCE_UPDATED"
    | "PAYMENT_MADE";
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  clubManagerId: string;
  clubId: string;
}

export const notificationHelper = {
  async sendNotification(data: NotificationData) {
    try {
      // This would be called from client-side components
      // We'll use a direct API call instead of tRPC for simplicity
      const response = await fetch("/api/trpc/notifications.create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          json: data,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error sending notification:", error);
      return { success: false, error };
    }
  },

  // Helper functions for specific notification types
  athleteAdded(
    athleteName: string,
    clubManagerId: string,
    clubId: string,
    metadata?: Record<string, unknown>
  ) {
    return this.sendNotification({
      type: "ATHLETE_ADDED",
      title: "Nouvel athlète ajouté",
      message: `L'athlète ${athleteName} a été ajouté avec succès.`,
      metadata,
      clubManagerId,
      clubId,
    });
  },

  athleteUpdated(
    athleteName: string,
    clubManagerId: string,
    clubId: string,
    metadata?: Record<string, unknown>
  ) {
    return this.sendNotification({
      type: "ATHLETE_UPDATED",
      title: "Athlète modifié",
      message: `Les informations de l'athlète ${athleteName} ont été mises à jour.`,
      metadata,
      clubManagerId,
      clubId,
    });
  },

  athleteDeleted(
    athleteName: string,
    clubManagerId: string,
    clubId: string,
    metadata?: Record<string, unknown>
  ) {
    return this.sendNotification({
      type: "ATHLETE_DELETED",
      title: "Athlète supprimé",
      message: `L'athlète ${athleteName} a été supprimé.`,
      metadata,
      clubManagerId,
      clubId,
    });
  },

  insuranceUpdated(
    athleteName: string,
    clubManagerId: string,
    clubId: string,
    metadata?: Record<string, unknown>
  ) {
    return this.sendNotification({
      type: "INSURANCE_UPDATED",
      title: "Assurance mise à jour",
      message: `L'assurance de l'athlète ${athleteName} a été mise à jour.`,
      metadata,
      clubManagerId,
      clubId,
    });
  },

  paymentMade(
    amount: number,
    clubManagerId: string,
    clubId: string,
    metadata?: Record<string, unknown>
  ) {
    return this.sendNotification({
      type: "PAYMENT_MADE",
      title: "Paiement effectué",
      message: `Un paiement de ${amount} MAD a été effectué.`,
      metadata,
      clubManagerId,
      clubId,
    });
  },
};
