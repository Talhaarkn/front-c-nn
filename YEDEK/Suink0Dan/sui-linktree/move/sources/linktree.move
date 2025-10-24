module linktree::profile {
    use std::string::{String};
    use sui::table::{Self, Table};
    use sui::event;

    // =================== Errors ===================
    const EInvalidLinkIndex: u64 = 0;
    const ENameAlreadyExists: u64 = 1;
    const ENotOwner: u64 = 2;

    // =================== Structs ===================
    
    /// Represents a single link in the profile
    public struct Link has store, copy, drop {
        label: String,
        url: String,
        icon: String, // Optional icon/emoji
    }

    /// Main LinkTree Profile object
    public struct LinkTreeProfile has key, store {
        id: UID,
        owner: address,
        name: String,
        avatar_url: String,
        bio: String,
        links: vector<Link>,
        theme: String, // e.g., "dark", "light", "gradient"
        background_color: String,
        text_color: String,
        created_at: u64,
        updated_at: u64,
    }

    /// Registry for name -> profile_id mapping using dynamic fields
    public struct ProfileRegistry has key {
        id: UID,
        names: Table<String, address>, // name -> profile object_id
    }

    // =================== Events ===================
    
    public struct ProfileCreated has copy, drop {
        profile_id: address,
        owner: address,
        name: String,
    }

    public struct ProfileUpdated has copy, drop {
        profile_id: address,
        owner: address,
    }

    public struct LinkAdded has copy, drop {
        profile_id: address,
        label: String,
        url: String,
    }

    // =================== Init Function ===================
    
    fun init(ctx: &mut TxContext) {
        let registry = ProfileRegistry {
            id: object::new(ctx),
            names: table::new(ctx),
        };
        transfer::share_object(registry);
    }

    // =================== Public Functions ===================
    
    /// Create a new LinkTree profile
    public entry fun create_profile(
        registry: &mut ProfileRegistry,
        name: String,
        avatar_url: String,
        bio: String,
        theme: String,
        background_color: String,
        text_color: String,
        ctx: &mut TxContext
    ) {
        // Check if name already exists
        assert!(!table::contains(&registry.names, name), ENameAlreadyExists);
        
        let sender = tx_context::sender(ctx);
        let profile = LinkTreeProfile {
            id: object::new(ctx),
            owner: sender,
            name,
            avatar_url,
            bio,
            links: vector::empty(),
            theme,
            background_color,
            text_color,
            created_at: tx_context::epoch(ctx),
            updated_at: tx_context::epoch(ctx),
        };

        let profile_addr = object::uid_to_address(&profile.id);
        
        // Register the name
        table::add(&mut registry.names, profile.name, profile_addr);

        event::emit(ProfileCreated {
            profile_id: profile_addr,
            owner: sender,
            name: profile.name,
        });

        transfer::public_share_object(profile);
    }

    /// Update profile information
    public entry fun update_profile(
        profile: &mut LinkTreeProfile,
        avatar_url: String,
        bio: String,
        theme: String,
        background_color: String,
        text_color: String,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        
        profile.avatar_url = avatar_url;
        profile.bio = bio;
        profile.theme = theme;
        profile.background_color = background_color;
        profile.text_color = text_color;
        profile.updated_at = tx_context::epoch(ctx);

        event::emit(ProfileUpdated {
            profile_id: object::uid_to_address(&profile.id),
            owner: profile.owner,
        });
    }

    /// Add a new link to the profile
    public entry fun add_link(
        profile: &mut LinkTreeProfile,
        label: String,
        url: String,
        icon: String,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        
        let link = Link {
            label,
            url,
            icon,
        };
        
        vector::push_back(&mut profile.links, link);
        profile.updated_at = tx_context::epoch(ctx);

        event::emit(LinkAdded {
            profile_id: object::uid_to_address(&profile.id),
            label: link.label,
            url: link.url,
        });
    }

    /// Remove a link by index
    public entry fun remove_link(
        profile: &mut LinkTreeProfile,
        index: u64,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        assert!(index < vector::length(&profile.links), EInvalidLinkIndex);
        
        vector::remove(&mut profile.links, index);
        profile.updated_at = tx_context::epoch(ctx);

        event::emit(ProfileUpdated {
            profile_id: object::uid_to_address(&profile.id),
            owner: profile.owner,
        });
    }

    /// Update a link by index
    public entry fun update_link(
        profile: &mut LinkTreeProfile,
        index: u64,
        label: String,
        url: String,
        icon: String,
        ctx: &mut TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        assert!(index < vector::length(&profile.links), EInvalidLinkIndex);
        
        let link = vector::borrow_mut(&mut profile.links, index);
        link.label = label;
        link.url = url;
        link.icon = icon;
        
        profile.updated_at = tx_context::epoch(ctx);

        event::emit(ProfileUpdated {
            profile_id: object::uid_to_address(&profile.id),
            owner: profile.owner,
        });
    }

    // =================== View Functions ===================
    
    /// Get profile by name
    public fun get_profile_by_name(registry: &ProfileRegistry, name: String): address {
        *table::borrow(&registry.names, name)
    }

    /// Check if name exists
    public fun name_exists(registry: &ProfileRegistry, name: String): bool {
        table::contains(&registry.names, name)
    }

    // Getter functions
    public fun get_owner(profile: &LinkTreeProfile): address {
        profile.owner
    }

    public fun get_name(profile: &LinkTreeProfile): String {
        profile.name
    }

    public fun get_avatar_url(profile: &LinkTreeProfile): String {
        profile.avatar_url
    }

    public fun get_bio(profile: &LinkTreeProfile): String {
        profile.bio
    }

    public fun get_theme(profile: &LinkTreeProfile): String {
        profile.theme
    }

    public fun get_background_color(profile: &LinkTreeProfile): String {
        profile.background_color
    }

    public fun get_text_color(profile: &LinkTreeProfile): String {
        profile.text_color
    }

    public fun get_links_count(profile: &LinkTreeProfile): u64 {
        vector::length(&profile.links)
    }
}

