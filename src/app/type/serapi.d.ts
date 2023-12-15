export interface SerapiResponse {
  search_metadata: SearchMetadata;
  search_parameters: SearchParameters;
  search_information: SearchInformation;
  shopping_results: ShoppingResult[];
  suggested_searches: SuggestedSearch[];
  images_results: ImagesResult[];
  related_searches: RelatedSearch[];
}

export interface SearchMetadata {
  id: string;
  status: string;
  json_endpoint: string;
  created_at: string;
  processed_at: string;
  google_images_url: string;
  raw_html_file: string;
  total_time_taken: number;
}

export interface SearchParameters {
  engine: string;
  q: string;
  google_domain: string;
  hl: string;
  gl: string;
  ijn: string;
  device: string;
}

export interface SearchInformation {
  image_results_state: string;
  menu_items: MenuItem[];
}

export interface MenuItem {
  position: number;
  title: string;
  link?: string;
  serpapi_link?: string;
}

export interface ShoppingResult {
  position: number;
  title: string;
  price: string;
  extracted_price: number;
  link: string;
  source: string;
  shipping?: string;
  thumbnail: string;
}

export interface SuggestedSearch {
  name: string;
  link: string;
  chips: string;
  serpapi_link: string;
  thumbnail: string;
}

export interface ImagesResult {
  position: number;
  thumbnail: string;
  related_content_id: string;
  serpapi_related_content_link: string;
  source: string;
  source_logo: string;
  title: string;
  link: string;
  original: string;
  original_width: number;
  original_height: number;
  is_product: boolean;
  tag?: string;
}

export interface RelatedSearch {
  link: string;
  serpapi_link: string;
  query: string;
  highlighted_words: string[];
  thumbnail: string;
}
