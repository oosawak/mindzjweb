/* tslint:disable */
/* eslint-disable */

export class SokobanGame {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    get_elapsed(): number;
    get_moves(): number;
    is_won(): boolean;
    move_player(dx: number, dy: number): void;
    static new(): SokobanGame;
    render(canvas_id: string): void;
    reset(): void;
    tick(ts: number): void;
}

/**
 * 全サウンド定義をJSON配列で返す（デバッグ・ツール用）
 */
export function all_sound_defs_maze3d(): string;

export function animal_puzzle_animals(): Uint8Array;

export function animal_puzzle_count(): number;

export function animal_puzzle_generate(size: number, difficulty: number): string;

export function animal_puzzle_init(size: number): void;

export function animal_puzzle_is_occupied(row: number, col: number): boolean;

export function animal_puzzle_is_solved(): boolean;

export function animal_puzzle_is_valid(row: number, col: number): boolean;

export function animal_puzzle_reset(): void;

export function animal_puzzle_set_solution(solution: Uint8Array): boolean;

export function animal_puzzle_set_zones(zones: Uint8Array): boolean;

export function animal_puzzle_size(): number;

export function animal_puzzle_toggle(row: number, col: number): boolean;

export function animal_puzzle_zones(): Uint8Array;

export function audio_event_blaster3d(): number;

export function audio_event_earthdef(): number;

/**
 * 音声イベントフラグ (0=なし 1=足音 2=壁衝突 3=レベルクリア 4=ゴール付近)
 */
export function audio_event_maze3d(): number;

export function audio_event_pacman(): number;

export function audio_samples_msx(): Float32Array;

/**
 * 足音の左右パリティ (true=左足)
 */
export function audio_step_parity_maze3d(): boolean;

export function auto_fire_blaster3d(): boolean;

export function best_level_maze3d(): number;

export function best_steps_maze3d(): number;

export function boot_cartridge_msx(): void;

export function boss_hp_blaster3d(): number;

export function boss_max_hp_blaster3d(): number;

export function bullet_count_blaster3d(): number;

export function camera_mode_blaster3d(): number;

export function camera_name_blaster3d(): string;

export function debug_info_msx(): string;

export function debug_log_clear_msx(): void;

export function debug_log_msx(): string;

export function draw_pacman(): void;

export function earth_hp_earthdef(): number;

export function earth_max_hp_earthdef(): number;

export function enemy_x_maze3d(): number;

export function enemy_z_maze3d(): number;

/**
 * Bold フォントバイト列を返す（embed-font 時のみ）。
 */
export function engine_font_bold(): Uint8Array;

/**
 * フォントが WASM バイナリに埋め込まれているかどうかを返す。
 * JS 初期化時にこの値で分岐すること。
 */
export function engine_font_embedded(): boolean;

/**
 * Regular フォントバイト列を返す。
 * `embed-font` feature でビルドした場合のみデータが入る。
 * feature なしビルドでは長さ0の Uint8Array が返り、
 * JS 側は外部ファイル（docs/fonts/）へフォールバックする。
 */
export function engine_font_regular(): Uint8Array;

export function fast_boot_msx(frames: number): void;

export function fire_at_screen_earthdef(nx: number, ny: number): void;

export function fire_earthdef(): void;

export function flash_bomb_earthdef(): void;

export function flash_charges_earthdef(): number;

export function force_slot_select(val: number): void;

export function frame_buffer_msx(): Uint8Array;

export function game_over_maze3d(): boolean;

export function init_blaster3d(canvas_id: string): Promise<void>;

export function init_earthdef(canvas_id: string): Promise<void>;

export function init_maze3d(canvas_id: string): Promise<void>;

export function init_msx(): void;

export function init_pacman(): void;

export function inspect_vrm(data: Uint8Array): string;

export function is_boss_wave_blaster3d(): boolean;

export function key_down_msx(code: string): void;

export function key_up_msx(code: string): void;

export function laser_type_earthdef(): number;

export function level_clear_maze3d(): boolean;

export function level_maze3d(): number;

export function lives_pacman(): number;

export function load_amb_vol_maze3d(): number;

export function load_bios_msx(data: Uint8Array): void;

export function load_rom_msx(data: Uint8Array): void;

export function load_se_vol_maze3d(): number;

export function load_sub_rom_msx(data: Uint8Array): void;

export function maze_data_maze3d(): Uint8Array;

export function move_blaster3d(dx: number, dz: number): void;

export function move_maze3d(a: number): void;

export function next_level_maze3d(): void;

/**
 * Returns game phase: 0=Playing, 1=Dying, 2=GameOver, 3=LevelClear
 */
export function phase_pacman(): number;

export function play_count_maze3d(): number;

export function player_facing_maze3d(): number;

export function player_hp_blaster3d(): number;

export function player_max_hp_blaster3d(): number;

export function player_x_maze3d(): number;

export function player_z_maze3d(): number;

export function reset_maze3d(): void;

export function save_audio_vol_maze3d(se: number, amb: number): void;

export function scene_blaster3d(): number;

export function scene_earthdef(): number;

export function scene_maze3d(): number;

export function score_blaster3d(): number;

export function score_earthdef(): number;

export function score_pacman(): number;

export function set_aim_input_earthdef(x: number, y: number): void;

export function set_cam_distance_earthdef(d: number): void;

export function set_cam_input_earthdef(x: number, y: number): void;

export function set_input_pacman(dir: number): void;

export function set_laser_type_earthdef(t: number): void;

export function shoot_blaster3d(on: boolean): void;

/**
 * サウンド定義 JSON を返す
 * 1=shoot, 2=enemy_shoot, 3=enemy_hit, 4=explosion, 5=stage_clear, 6=player_hit, 7=boss_appear, 8=game_over
 */
export function sound_def_blaster3d(event: number): string;

/**
 * AudioEventに対応するサウンド定義JSONを返す
 * event: 1=step_left, 2=step_right, 3=wall_hit, 4=level_clear, 5=goal_near, 6=enemy_near, 7=game_over
 */
export function sound_def_maze3d(event: number): string;

export function start_blaster3d(): void;

export function start_earthdef(): void;

export function start_game_maze3d(): void;

export function steps_maze3d(): number;

export function switch_camera_blaster3d(): void;

export function theme_name_maze3d(): string;

export function tick_blaster3d(ts: number): void;

export function tick_earthdef(ts: number): void;

export function tick_maze3d(ts: number): void;

export function tick_msx(): void;

export function tick_pacman(dt: number): void;

export function toggle_auto_fire_blaster3d(): void;

export function total_steps_maze3d(): number;

export function turret_rotate_blaster3d(rot: number): void;

export function warp_done_maze3d(): boolean;

export function warp_maze3d(): number;

export function wave_blaster3d(): number;

export function wave_earthdef(): number;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly inspect_vrm: (a: number, b: number) => [number, number];
    readonly __wbg_sokobangame_free: (a: number, b: number) => void;
    readonly sokobangame_get_elapsed: (a: number) => number;
    readonly sokobangame_get_moves: (a: number) => number;
    readonly sokobangame_is_won: (a: number) => number;
    readonly sokobangame_move_player: (a: number, b: number, c: number) => void;
    readonly sokobangame_new: () => number;
    readonly sokobangame_render: (a: number, b: number, c: number) => [number, number];
    readonly sokobangame_reset: (a: number) => void;
    readonly sokobangame_tick: (a: number, b: number) => void;
    readonly animal_puzzle_animals: () => [number, number];
    readonly animal_puzzle_count: () => number;
    readonly animal_puzzle_generate: (a: number, b: number) => [number, number];
    readonly animal_puzzle_init: (a: number) => void;
    readonly animal_puzzle_is_occupied: (a: number, b: number) => number;
    readonly animal_puzzle_is_solved: () => number;
    readonly animal_puzzle_is_valid: (a: number, b: number) => number;
    readonly animal_puzzle_reset: () => void;
    readonly animal_puzzle_set_solution: (a: number, b: number) => number;
    readonly animal_puzzle_set_zones: (a: number, b: number) => number;
    readonly animal_puzzle_size: () => number;
    readonly animal_puzzle_toggle: (a: number, b: number) => number;
    readonly animal_puzzle_zones: () => [number, number];
    readonly all_sound_defs_maze3d: () => [number, number];
    readonly audio_event_blaster3d: () => number;
    readonly audio_event_earthdef: () => number;
    readonly audio_event_maze3d: () => number;
    readonly audio_event_pacman: () => number;
    readonly audio_samples_msx: () => [number, number];
    readonly audio_step_parity_maze3d: () => number;
    readonly auto_fire_blaster3d: () => number;
    readonly best_level_maze3d: () => number;
    readonly best_steps_maze3d: () => number;
    readonly boot_cartridge_msx: () => void;
    readonly boss_hp_blaster3d: () => number;
    readonly boss_max_hp_blaster3d: () => number;
    readonly bullet_count_blaster3d: () => number;
    readonly camera_mode_blaster3d: () => number;
    readonly camera_name_blaster3d: () => [number, number];
    readonly debug_info_msx: () => [number, number];
    readonly debug_log_clear_msx: () => void;
    readonly debug_log_msx: () => [number, number];
    readonly draw_pacman: () => void;
    readonly earth_hp_earthdef: () => number;
    readonly earth_max_hp_earthdef: () => number;
    readonly enemy_x_maze3d: () => number;
    readonly enemy_z_maze3d: () => number;
    readonly engine_font_bold: () => [number, number];
    readonly engine_font_embedded: () => number;
    readonly fast_boot_msx: (a: number) => void;
    readonly fire_at_screen_earthdef: (a: number, b: number) => void;
    readonly fire_earthdef: () => void;
    readonly flash_bomb_earthdef: () => void;
    readonly flash_charges_earthdef: () => number;
    readonly force_slot_select: (a: number) => void;
    readonly frame_buffer_msx: () => [number, number];
    readonly game_over_maze3d: () => number;
    readonly init_blaster3d: (a: number, b: number) => any;
    readonly init_earthdef: (a: number, b: number) => any;
    readonly init_maze3d: (a: number, b: number) => any;
    readonly init_msx: () => void;
    readonly init_pacman: () => void;
    readonly is_boss_wave_blaster3d: () => number;
    readonly key_down_msx: (a: number, b: number) => void;
    readonly key_up_msx: (a: number, b: number) => void;
    readonly laser_type_earthdef: () => number;
    readonly level_clear_maze3d: () => number;
    readonly level_maze3d: () => number;
    readonly lives_pacman: () => number;
    readonly load_amb_vol_maze3d: () => number;
    readonly load_bios_msx: (a: number, b: number) => void;
    readonly load_rom_msx: (a: number, b: number) => void;
    readonly load_se_vol_maze3d: () => number;
    readonly load_sub_rom_msx: (a: number, b: number) => void;
    readonly maze_data_maze3d: () => [number, number];
    readonly move_blaster3d: (a: number, b: number) => void;
    readonly move_maze3d: (a: number) => void;
    readonly next_level_maze3d: () => void;
    readonly phase_pacman: () => number;
    readonly play_count_maze3d: () => number;
    readonly player_facing_maze3d: () => number;
    readonly player_hp_blaster3d: () => number;
    readonly player_max_hp_blaster3d: () => number;
    readonly player_x_maze3d: () => number;
    readonly player_z_maze3d: () => number;
    readonly reset_maze3d: () => void;
    readonly save_audio_vol_maze3d: (a: number, b: number) => void;
    readonly scene_blaster3d: () => number;
    readonly scene_earthdef: () => number;
    readonly scene_maze3d: () => number;
    readonly score_blaster3d: () => number;
    readonly score_earthdef: () => number;
    readonly score_pacman: () => number;
    readonly set_aim_input_earthdef: (a: number, b: number) => void;
    readonly set_cam_distance_earthdef: (a: number) => void;
    readonly set_cam_input_earthdef: (a: number, b: number) => void;
    readonly set_input_pacman: (a: number) => void;
    readonly set_laser_type_earthdef: (a: number) => void;
    readonly shoot_blaster3d: (a: number) => void;
    readonly sound_def_blaster3d: (a: number) => [number, number];
    readonly sound_def_maze3d: (a: number) => [number, number];
    readonly start_blaster3d: () => void;
    readonly start_earthdef: () => void;
    readonly start_game_maze3d: () => void;
    readonly steps_maze3d: () => number;
    readonly switch_camera_blaster3d: () => void;
    readonly theme_name_maze3d: () => [number, number];
    readonly tick_blaster3d: (a: number) => void;
    readonly tick_earthdef: (a: number) => void;
    readonly tick_maze3d: (a: number) => void;
    readonly tick_msx: () => void;
    readonly tick_pacman: (a: number) => void;
    readonly toggle_auto_fire_blaster3d: () => void;
    readonly total_steps_maze3d: () => number;
    readonly turret_rotate_blaster3d: (a: number) => void;
    readonly warp_done_maze3d: () => number;
    readonly warp_maze3d: () => number;
    readonly wave_blaster3d: () => number;
    readonly wave_earthdef: () => number;
    readonly engine_font_regular: () => [number, number];
    readonly wgpu_render_pass_draw: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wgpu_render_pass_draw_indexed: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly wgpu_render_pass_set_pipeline: (a: number, b: bigint) => void;
    readonly wgpu_render_pass_set_viewport: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
    readonly wgpu_compute_pass_set_pipeline: (a: number, b: bigint) => void;
    readonly wgpu_render_pass_draw_indirect: (a: number, b: bigint, c: bigint) => void;
    readonly wgpu_render_bundle_draw: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wgpu_render_pass_set_bind_group: (a: number, b: number, c: bigint, d: number, e: number) => void;
    readonly wgpu_compute_pass_set_bind_group: (a: number, b: number, c: bigint, d: number, e: number) => void;
    readonly wgpu_render_pass_execute_bundles: (a: number, b: number, c: number) => void;
    readonly wgpu_render_pass_pop_debug_group: (a: number) => void;
    readonly wgpu_render_pass_write_timestamp: (a: number, b: bigint, c: number) => void;
    readonly wgpu_compute_pass_pop_debug_group: (a: number) => void;
    readonly wgpu_compute_pass_write_timestamp: (a: number, b: bigint, c: number) => void;
    readonly wgpu_render_pass_push_debug_group: (a: number, b: number, c: number) => void;
    readonly wgpu_render_pass_set_scissor_rect: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wgpu_compute_pass_push_debug_group: (a: number, b: number, c: number) => void;
    readonly wgpu_render_pass_set_vertex_buffer: (a: number, b: number, c: bigint, d: bigint, e: bigint) => void;
    readonly wgpu_render_pass_set_blend_constant: (a: number, b: number) => void;
    readonly wgpu_render_pass_set_push_constants: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wgpu_compute_pass_set_push_constant: (a: number, b: number, c: number, d: number) => void;
    readonly wgpu_render_pass_end_occlusion_query: (a: number) => void;
    readonly wgpu_render_pass_insert_debug_marker: (a: number, b: number, c: number) => void;
    readonly wgpu_render_pass_multi_draw_indirect: (a: number, b: bigint, c: bigint, d: number) => void;
    readonly wgpu_compute_pass_dispatch_workgroups: (a: number, b: number, c: number, d: number) => void;
    readonly wgpu_compute_pass_insert_debug_marker: (a: number, b: number, c: number) => void;
    readonly wgpu_render_pass_begin_occlusion_query: (a: number, b: number) => void;
    readonly wgpu_render_pass_draw_indexed_indirect: (a: number, b: bigint, c: bigint) => void;
    readonly wgpu_render_pass_set_stencil_reference: (a: number, b: number) => void;
    readonly wgpu_render_bundle_draw_indexed: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
    readonly wgpu_render_bundle_set_pipeline: (a: number, b: bigint) => void;
    readonly wgpu_render_bundle_draw_indirect: (a: number, b: bigint, c: bigint) => void;
    readonly wgpu_render_bundle_set_bind_group: (a: number, b: number, c: bigint, d: number, e: number) => void;
    readonly wgpu_render_pass_multi_draw_indirect_count: (a: number, b: bigint, c: bigint, d: bigint, e: bigint, f: number) => void;
    readonly wgpu_render_bundle_set_vertex_buffer: (a: number, b: number, c: bigint, d: bigint, e: bigint) => void;
    readonly wgpu_render_pass_multi_draw_indexed_indirect: (a: number, b: bigint, c: bigint, d: number) => void;
    readonly wgpu_render_bundle_set_push_constants: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly wgpu_compute_pass_dispatch_workgroups_indirect: (a: number, b: bigint, c: bigint) => void;
    readonly wgpu_render_pass_end_pipeline_statistics_query: (a: number) => void;
    readonly wgpu_compute_pass_end_pipeline_statistics_query: (a: number) => void;
    readonly wgpu_render_bundle_draw_indexed_indirect: (a: number, b: bigint, c: bigint) => void;
    readonly wgpu_render_pass_begin_pipeline_statistics_query: (a: number, b: bigint, c: number) => void;
    readonly wgpu_compute_pass_begin_pipeline_statistics_query: (a: number, b: bigint, c: number) => void;
    readonly wgpu_render_pass_multi_draw_indexed_indirect_count: (a: number, b: bigint, c: bigint, d: bigint, e: bigint, f: number) => void;
    readonly wgpu_render_bundle_insert_debug_marker: (a: number, b: number) => void;
    readonly wgpu_render_bundle_pop_debug_group: (a: number) => void;
    readonly wgpu_render_bundle_set_index_buffer: (a: number, b: bigint, c: number, d: bigint, e: bigint) => void;
    readonly wgpu_render_bundle_push_debug_group: (a: number, b: number) => void;
    readonly wgpu_render_pass_set_index_buffer: (a: number, b: bigint, c: number, d: bigint, e: bigint) => void;
    readonly wasm_bindgen_927636a64d667a37___convert__closures_____invoke___wasm_bindgen_927636a64d667a37___JsValue__core_e1dd1f5b63695bbf___result__Result_____wasm_bindgen_927636a64d667a37___JsError___true_: (a: number, b: number, c: any) => [number, number];
    readonly wasm_bindgen_927636a64d667a37___convert__closures_____invoke___js_sys_43adb5b339f1e686___Function_fn_wasm_bindgen_927636a64d667a37___JsValue_____wasm_bindgen_927636a64d667a37___sys__Undefined___js_sys_43adb5b339f1e686___Function_fn_wasm_bindgen_927636a64d667a37___JsValue_____wasm_bindgen_927636a64d667a37___sys__Undefined_______true_: (a: number, b: number, c: any, d: any) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_destroy_closure: (a: number, b: number) => void;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
