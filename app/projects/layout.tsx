import Navigation from '../../components/Navigation';
import React from 'react';

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Navigation />
			<div className="pt-10">{children}</div>
		</>
	);
}
