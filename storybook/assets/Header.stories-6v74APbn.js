import{j as r,M as d,p as f}from"./iframe-K1-r__6v.js";import{H as g}from"./Header-BWTzWmCG.js";import{t as v}from"./index-qh46O5KH.js";import{M as y,a as x,b as B}from"./Menu-DJTfBRiW.js";import{B as w}from"./ButtonIcon-DWm1pVea.js";import{B as b}from"./BUIProvider-BXUq6XUb.js";import{B as h}from"./Button-ZPUSxDHq.js";import"./preload-helper-PPVm8Dsz.js";import"./useGlobalListeners-hYY01nOS.js";import"./useObjectRef-B6g01Sss.js";import"./openLink-Buy5e0wx.js";import"./useHover-BjUJEgQT.js";import"./useLink-C8uP6D0g.js";import"./usePress-DFgFgQIS.js";import"./textSelection-DEpXXoD2.js";import"./Button-i1ES9tsK.js";import"./utils-CmXvhRmv.js";import"./Label-DB_fk5tK.js";import"./Hidden-Bruv6eby.js";import"./useLabel-DIPqeGbV.js";import"./useLabels-WOLYX76B.js";import"./number-CqVwgbk4.js";import"./I18nProvider-BOTPuHRS.js";import"./useButton-C_LWOP2v.js";import"./Container-CZPRsCeY.js";import"./Link-wbxVzVd-.js";import"./getNodeText-CULtpH0y.js";import"./Text-DRqTg2b9.js";import"./Autocomplete-CvG3U5A4.js";import"./keyboard-DxL8AXMs.js";import"./useEvent-CIbwz_kM.js";import"./useLocalizedStringFormatter-CfiXUqON.js";import"./useControlledState-Dy4k5Q4V.js";import"./getItemCount-D3Pj2Gkt.js";import"./useCollection-B-lXaARj.js";import"./FocusScope-M2Rr-K_Q.js";import"./useTextField-AN4s7yIJ.js";import"./useField-DPkfUDN-.js";import"./useFormReset-Cvno6jO2.js";import"./useFormValidation-DCdCyMkZ.js";import"./ListBox-X8o-QJQt.js";import"./Text-NxcU8Wst.js";import"./useListState-TvB53Ymu.js";import"./Dialog-D04XGRIc.js";import"./Heading-DJVWOyt3.js";import"./useOverlayTriggerState-t3pADMOa.js";import"./VisuallyHidden-BRIhty-1.js";import"./animation-d11LJbXp.js";import"./SearchField-e_6EFV3S.js";import"./FieldError-CnXsXmD3.js";import"./Virtualizer-DVvYxoxv.js";import"./useFilter-921X9CTX.js";import"./linkUtils-tKDL5Jm1.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),p=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],c=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...u.input.parameters?.docs?.source}}};const Ir=["Default","WithTabs","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithEverything","WithGroupedTabs","WithExplicitActiveTab"];export{t as Default,n as WithBreadcrumbs,i as WithCustomActions,p as WithEverything,u as WithExplicitActiveTab,c as WithGroupedTabs,m as WithLongBreadcrumbs,s as WithTabs,Ir as __namedExportsOrder};
