export interface UserPostData {
	_id: string,
	pseudo: string
}

export interface Post {
    _id: string,
	authors: UserPostData[],
	title: string,
	body: string,
	timestamp: Date,
	content?: { mimetype: string, size: number, data: BinaryData },
	visible?: boolean,
};