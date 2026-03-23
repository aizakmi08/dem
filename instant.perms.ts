export default {
  profiles: {
    allow: {
      view: "auth.id in data.ref('$user.id')",
      create: "auth.id in data.ref('$user.id')",
      update: "auth.id in data.ref('$user.id')",
      delete: "auth.id in data.ref('$user.id')",
    },
  },

  progressEntries: {
    allow: {
      view: "auth.id in data.ref('$user.id')",
      create: "auth.id in data.ref('$user.id')",
      update: "auth.id in data.ref('$user.id')",
      delete: "auth.id in data.ref('$user.id')",
    },
  },

  favorites: {
    allow: {
      view: "auth.id in data.ref('$user.id')",
      create: "auth.id in data.ref('$user.id')",
      update: "auth.id in data.ref('$user.id')",
      delete: "auth.id in data.ref('$user.id')",
    },
  },

  customRoutines: {
    allow: {
      // Users can see their own routines + shared ones
      view: "auth.id in data.ref('$user.id') || data.isShared == true",
      create: "auth.id in data.ref('$user.id')",
      update: "auth.id in data.ref('$user.id')",
      delete: "auth.id in data.ref('$user.id')",
    },
  },
} as const;
