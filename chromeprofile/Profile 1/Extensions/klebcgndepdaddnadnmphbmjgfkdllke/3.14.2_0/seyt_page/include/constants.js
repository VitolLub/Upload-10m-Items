'use strict';

const PLAYER_START = 'player_start';
const PLAYER_PLAY = 'player_play';
const PLAYER_PAUSE = 'player_pause';
const PLAYER_STOP = 'player_stop';
const PLAYER_REWIND = 'player_rewind';
const PLAYER_SPEED_CHANGED = 'player_speed_changed';

const STATE_IS_INITIAL = 'state_is_initial';
const STATE_IS_PLAYING = 'state_is_playing';
const STATE_IS_PAUSED = 'state_is_paused';
const STATE_IS_OUT_FOCUS = 'state_is_out_focus';
const STATE_FOCUS_RESTORED = 'state_focus_restored';
const STATE_IS_FINISHED = 'state_is_finished';
const STATE_IS_CANCELED = 'state_is_canceled';
const STATE_IS_JOB_ERROR = 'state_is_job_error';
const STATE_IS_COMPLETED = 'state_is_completed';
const STATE_CAPTCHA_TIMEOUT = 'state_captcha_timeout';
const STATE_LIMIT_IS_OVER = 'state_limit_is_over';
const STATE_AUTH_ERROR = 'state_auth_error';
const STATE_PLAYER_SIZE_TOO_SMALL = 'state_player_size_too_small';
const STATE_PLAYER_SIZE_RESTORED = 'state_player_size_restored';

const CAPTCHA_ENABLED = 'captcha_enabled';

const CANCEL_REASON_TIME_IS_OVER = 'cancel_reason_time_is_over';
const CANCEL_REASON_WAS_REWIND = 'cancel_reason_was_rewind';
const CANCEL_REASON_ANOTHER_VIDEO = 'cancel_reason_another_video';
const CANCEL_REASON_ANOTHER_PAGE = 'cancel_reason_another_page';
const CANCEL_REASON_PAGE_CLOSED = 'cancel_reason_page_closed';
const CANCEL_REASON_FOCUS_LOST = 'cancel_reason_focus_lost';
const CANCEL_REASON_SPEED_CHANGED = 'cancel_reason_speed_changed';
const CANCEL_REASON_CAPTCHA_TIMEOUT = 'cancel_reason_captcha_timeout';
const CANCEL_REASON_NOT_ENOUGH_VIDEO_REMAINS = 'cancel_reason_not_enough_video_remains';

const ERROR_RECEIVING_CPA = 'error_receiving_cpa';
const ERROR_VIDEO_ADS_REDIRECT = 'error_video_ads_redirect';

const SE_PLAYER_REWIND_CHECK_ENABLED = 0;
