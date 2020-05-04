export interface KintoneRecord {
  type: string;
  value: string;
}

export interface SimilarityRecord {
  $id: KintoneRecord;
  line_user_id: KintoneRecord;
  class_name: KintoneRecord;
  score: KintoneRecord;
  image_url: KintoneRecord;
  created_at: KintoneRecord;
  updated_at: KintoneRecord;
}

export interface UserRecord {
  line_user_id: KintoneRecord;
  line_display_name: KintoneRecord;
  line_picture_url: KintoneRecord;
  line_user_language: KintoneRecord;
  created_at: KintoneRecord;
  updated_at: KintoneRecord;
}
