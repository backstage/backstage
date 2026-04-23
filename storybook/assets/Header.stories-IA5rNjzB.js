import{j as r,M as d,p as f}from"./iframe-BkP0WlJq.js";import{H as g}from"./Header-BY0zpM6-.js";import{t as v}from"./index-nUlAPM-b.js";import{M as y,a as x,b as B}from"./Menu-DxsyBN9e.js";import{B as w}from"./ButtonIcon-CmBjjN0V.js";import{B as b}from"./BUIProvider-CPBk8mPw.js";import{B as h}from"./Button-Dh8sI6DJ.js";import"./preload-helper-PPVm8Dsz.js";import"./useGlobalListeners-BQ7uMXZm.js";import"./useObjectRef-Mf4vhbTH.js";import"./openLink-DB0Ca1x8.js";import"./useHover-eAsT_Ppr.js";import"./useLink-B-5Y-irM.js";import"./usePress-C8fD9tc5.js";import"./textSelection-BKZ9NYIi.js";import"./Button-lxle6TI0.js";import"./utils-DHN8Cm_h.js";import"./Label-BK2ZKRuT.js";import"./Hidden-BXffHnFQ.js";import"./useLabel-5YOqhmr6.js";import"./useLabels-B-zEBY3m.js";import"./number-C1OYSHYA.js";import"./I18nProvider-DmxvoEIH.js";import"./useButton-DhjtCbFy.js";import"./Container-Bi7AZ64B.js";import"./Link-BzLSjHhy.js";import"./useResolvedHref-B_fCet1Y.js";import"./getNodeText-Ok8NPnTx.js";import"./Text-UTxkE-7j.js";import"./Autocomplete-J1lADh76.js";import"./keyboard-D1MAaepU.js";import"./useEvent-CwHxOE_a.js";import"./useLocalizedStringFormatter-Cg_1Wz50.js";import"./useControlledState-BVQM9Nh9.js";import"./getItemCount-DDe4w_9O.js";import"./useCollection-CmpO0ThD.js";import"./FocusScope-JZzM0yEB.js";import"./Input-ByYqn8b2.js";import"./ListBox-D-vi6RK-.js";import"./Text-DkMI-_Pd.js";import"./useListState-Bo3ieulJ.js";import"./Dialog-DqD0WvZa.js";import"./Heading-4X8_LMGL.js";import"./useOverlayTriggerState-yqAD7bBJ.js";import"./VisuallyHidden-D5NF5zlS.js";import"./animation-X88qEdj0.js";import"./SearchField-F9f7PmCT.js";import"./FieldError-CXhtOli2.js";import"./useFormValidation-DdoBKiVP.js";import"./useTextField-BzdYefQX.js";import"./useField-DMvdg4ts.js";import"./useFormReset-C4fnlQFd.js";import"./Virtualizer-Dn7kOPOf.js";import"./useFilter-BHxP1hpK.js";const o=f.meta({title:"Backstage UI/Header",component:g,parameters:{layout:"fullscreen"}}),l=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],j=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],a=e=>r.jsx(d,{initialEntries:["/overview"],children:r.jsx(b,{children:r.jsx(e,{})})}),t=o.story({args:{title:"Page Title"}}),s=o.story({decorators:[a],args:{...t.input.args,tabs:l}}),i=o.story({decorators:[a],render:()=>r.jsx(g,{...t.input.args,customActions:r.jsxs(r.Fragment,{children:[r.jsx(h,{children:"Custom action"}),r.jsxs(y,{children:[r.jsx(w,{variant:"tertiary",icon:r.jsx(v,{}),"aria-label":"More options"}),r.jsx(x,{placement:"bottom end",children:j.map(e=>r.jsx(B,{onAction:e.onClick,href:e.href,children:e.label},e.value))})]})]})})}),n=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),m=o.story({decorators:[a],args:{...t.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),p=o.story({decorators:[a],args:{...t.input.args,tabs:l,customActions:r.jsx(h,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}]}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],c=o.story({decorators:[e=>r.jsx(d,{initialEntries:["/docs"],children:r.jsx(b,{children:r.jsx(e,{})})})],args:{...t.input.args,tabs:I}}),u=o.story({decorators:[a],args:{...t.input.args,tabs:l,activeTabId:"campaigns"}});t.input.parameters={...t.input.parameters,docs:{...t.input.parameters?.docs,source:{originalSource:`meta.story({
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
