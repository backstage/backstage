import{j as r,M as d,p as f}from"./iframe-CsCfxPn_.js";import{H as g}from"./Header-DWea7K1T.js";import{t as v}from"./index-BKt9zum2.js";import{M as y,a as x,b as B}from"./Menu-BsMek0Pz.js";import{B as w}from"./ButtonIcon-DsQGw-ed.js";import{B as b}from"./BUIProvider-Chhfm5Ik.js";import{B as h}from"./Button-Bi5na56j.js";import"./preload-helper-PPVm8Dsz.js";import"./useGlobalListeners-CpcV6s3I.js";import"./useObjectRef-BxfOcqJ5.js";import"./openLink-BrP_7GAS.js";import"./useHover-BQ1b8sFg.js";import"./useLink-ovttJqTY.js";import"./usePress-uzoVp1uP.js";import"./textSelection-CPUOakXR.js";import"./Button-pU6Owdb9.js";import"./utils-DvgauPIn.js";import"./Label-Hg0cB6oT.js";import"./Hidden-DJH4Ilgv.js";import"./useLabel-BvfmTbEA.js";import"./useLabels-WrXMeIyK.js";import"./number-CuOAqyVQ.js";import"./I18nProvider-BENFC-9w.js";import"./useButton-CJs9Ljhi.js";import"./Container-B03Zp86c.js";import"./Link-ChGcT_dK.js";import"./useResolvedHref-QiPi986T.js";import"./getNodeText-BcWbJeB5.js";import"./Text-DNRUl0Ae.js";import"./Autocomplete-Cv1VwB81.js";import"./keyboard-BprMhHK9.js";import"./useEvent-CFqEXxMT.js";import"./useLocalizedStringFormatter-CnHWyO0_.js";import"./useControlledState-DnnRo852.js";import"./getItemCount-BM0f6IzP.js";import"./useCollection-6vdc7J7q.js";import"./FocusScope-CQv_xJYu.js";import"./Input-CnzuwThE.js";import"./ListBox-B4XedE_g.js";import"./Text-BUxkZD4S.js";import"./useListState-BrcIr7mo.js";import"./Dialog-Sz24-WR-.js";import"./Heading-OGzQR_kx.js";import"./useOverlayTriggerState-BaKaQtSn.js";import"./VisuallyHidden-BxEns4sJ.js";import"./animation-DJKZC1DN.js";import"./SearchField-DdsD6HHj.js";import"./FieldError-DJPjJZjM.js";import"./useFormValidation-CbGwD0tJ.js";import"./useTextField-BtzsUAKL.js";import"./useField-D1Yteliv.js";import"./useFormReset-CmlsYa4s.js";import"./Virtualizer-Bs466d0i.js";import"./useFilter-BTwAjcNr.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),p=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],c=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Page Title'
  }
})`,...t.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs
  }
})`,...s.input.parameters?.docs?.source}}};i.input.parameters={...i.input.parameters,docs:{...i.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} customActions={<>
          <Button>Custom action</Button>
          <MenuTrigger>
            <ButtonIcon variant="tertiary" icon={<RiMore2Line />} aria-label="More options" />
            <Menu placement="bottom end">
              {menuItems.map(option => <MenuItem key={option.value} onAction={option.onClick} href={option.href}>
                  {option.label}
                </MenuItem>)}
            </Menu>
          </MenuTrigger>
        </>} />
})`,...i.input.parameters?.docs?.source}}};n.input.parameters={...n.input.parameters,docs:{...n.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }]
  }
})`,...n.input.parameters?.docs?.source}}};m.input.parameters={...m.input.parameters,docs:{...m.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }, {
      label: 'Long Breadcrumb Name',
      href: '/long-breadcrumb'
    }]
  }
})`,...m.input.parameters?.docs?.source}}};p.input.parameters={...p.input.parameters,docs:{...p.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs,
    customActions: <Button>Custom action</Button>,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }]
  }
})`,...p.input.parameters?.docs?.source}}};c.input.parameters={...c.input.parameters,docs:{...c.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [(Story: StoryFn) => <MemoryRouter initialEntries={['/docs']}>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>],
  args: {
    ...Default.input.args,
    tabs: groupedTabs
  }
})`,...c.input.parameters?.docs?.source}}};u.input.parameters={...u.input.parameters,docs:{...u.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs,
    activeTabId: 'campaigns'
  }
})`,...u.input.parameters?.docs?.source}}};const Mr=["Default","WithTabs","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithEverything","WithGroupedTabs","WithExplicitActiveTab"];export{t as Default,n as WithBreadcrumbs,i as WithCustomActions,p as WithEverything,u as WithExplicitActiveTab,c as WithGroupedTabs,m as WithLongBreadcrumbs,s as WithTabs,Mr as __namedExportsOrder};
