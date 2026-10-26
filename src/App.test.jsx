import {describe,it,expect} from 'vitest';
import {render,screen} from '@testing-library/react';
import {MemoryRouter} from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';
describe('site navigation',()=>{
 it('shows the home page with semantic regions and navigates to reservations',async()=>{render(<MemoryRouter><App/></MemoryRouter>);expect(screen.getByRole('main')).toBeInTheDocument();expect(screen.getByRole('heading',{level:1})).toHaveTextContent('Mediterranean');await userEvent.click(screen.getByRole('link',{name:/Find your seat/}));expect(screen.getByRole('heading',{level:1,name:'Your table is waiting.'})).toBeInTheDocument();});
 it('handles a direct confirmation URL without a receipt',()=>{render(<MemoryRouter initialEntries={['/confirmed']}><App/></MemoryRouter>);expect(screen.getByRole('heading',{name:'No reservation to show yet.'})).toBeVisible();});
 it('provides a recovery route for unknown pages',()=>{render(<MemoryRouter initialEntries={['/unknown']}><App/></MemoryRouter>);expect(screen.getByRole('heading',{name:'Let’s get you back to the table.'})).toBeVisible();});
 it('shows mobile navigation state using an accessible expanded attribute',async()=>{render(<MemoryRouter><App/></MemoryRouter>);const toggle=screen.getByRole('button',{name:/Menu/});expect(toggle).toHaveAttribute('aria-expanded','false');await userEvent.click(toggle);expect(screen.getByRole('button',{name:/Close menu/})).toHaveAttribute('aria-expanded','true');});
});
