

# Terms and Conditions Page

Create a new `/terms` route with a Terms and Conditions page following the existing visual pattern from `/support`.

## Changes

### 1. Create `src/pages/Terms.tsx`
- Use the same layout as `Support.tsx`: dark gradient background with `Orbs`, centered container, glass cards
- Content sections:
  - Header with decorative dot + "Termos e Condições" title
  - **Uso do Serviço** - rules for using the platform
  - **Pagamentos e Reembolsos** - payment terms, 7-day refund policy (consistent with Support page)
  - **Propriedade Intelectual** - content ownership and usage rights
  - **Privacidade** - brief privacy statement with reference to future privacy policy
  - **Limitação de Responsabilidade** - liability limitations
  - **Alterações nos Termos** - right to modify terms
  - **Contato** - support email (suporte@astraapp.com.br)
- Footer link back to `/quiz`
- All text in PT-BR with feminine-oriented language

### 2. Update `src/App.tsx`
- Import `Terms` component
- Add `<Route path="/terms" element={<Terms />} />` alongside other public routes

### 3. Update `src/pages/Plans.tsx`
- Wire the existing "Termos de uso" button to navigate to `/terms` using an `<a href="/terms">` or `<Link>`

