import{R as d,r as L,j as e,M as I,p as O}from"./iframe-Dl5_TB80.js";import{H as c}from"./Header-Civ_W6vg.js";import{a as N,b as E,c as q}from"./useObjectRef-C7LuogIC.js";import{$ as G}from"./usePress-B21q6wEs.js";import{$ as z}from"./useGlobalListeners-CtaBTdJV.js";import{L as $}from"./Link-CQLpr1vV.js";import{A as p}from"./Avatar-CA4qHqZM.js";import{T as C}from"./Text-XofFIW7_.js";import{T as F,a as J}from"./Tooltip-DCxb8W8b.js";import{t as K}from"./index-P6GXtDIS.js";import{a as Q,b as V,M as X}from"./Menu-DuSyADOn.js";import{B as Y}from"./ButtonIcon-DTrPE6KP.js";import{B as R}from"./BUIProvider-sLDoZC3d.js";import{B}from"./Button-CHQUooLY.js";import"./preload-helper-PPVm8Dsz.js";import"./useHover-9E6EvIXl.js";import"./useLink-BdkuffW-.js";import"./openLink-k3Gx7yeJ.js";import"./Button-BREXngrn.js";import"./utils-DGkaMaF3.js";import"./Label-CwMshdGF.js";import"./Hidden-1cRpW4wa.js";import"./useLabel-Bd4C7Sd8.js";import"./useLabels-CIaXcdIT.js";import"./number-CUJHByHy.js";import"./I18nProvider-DdxrthYO.js";import"./useButton-C9NVRh9l.js";import"./Container-gfuNyw7U.js";import"./textSelection-B7ezpFpp.js";import"./useResolvedHref-DRZH4CNB.js";import"./getNodeText-CYSmsz4e.js";import"./useOverlayTriggerState-BxYmwbcD.js";import"./useControlledState-CbZzhw3I.js";import"./animation-Bq67aj6L.js";import"./Autocomplete-cPStGh3M.js";import"./keyboard-9V0mj3_S.js";import"./useEvent-CDdnj45Y.js";import"./useLocalizedStringFormatter-CkAdB0KW.js";import"./getItemCount-CYpe8tJx.js";import"./useCollection-B83xlPxw.js";import"./FocusScope-CJwmhigo.js";import"./Input-4WNFixI8.js";import"./ListBox-BusgxILK.js";import"./Text-CmmTld-Z.js";import"./useListState-CLGPtH8Y.js";import"./Dialog-CtkcVP0X.js";import"./Heading-Bo0BxDrG.js";import"./VisuallyHidden-5kGZYaA8.js";import"./SearchField-CUQx6DeP.js";import"./FieldError-NLt2HR8A.js";import"./useFormValidation-DmmfnNyV.js";import"./useTextField-i2xYGhQB.js";import"./useField-DlYL5pdu.js";import"./useFormReset-BLjeDNKm.js";import"./Virtualizer-A5rKoY5F.js";import"./useFilter-D5huGqo5.js";const Z=d.forwardRef(({children:t,...a},i)=>{i=N(i);let{pressProps:U}=G({...a,ref:i}),{focusableProps:A}=z(a,i),u=d.Children.only(t);L.useEffect(()=>{},[i,a.isDisabled]);let P=parseInt(d.version,10)<19?u.ref:u.props.ref;return d.cloneElement(u,{...q(U,A,u.props),ref:E(P,i)})}),ee="_single_1dmyt_20",ae="_stack_1dmyt_27",re="_avatarLink_1dmyt_37",m={single:ee,stack:ae,avatarLink:re},l=({users:t})=>{if(t.length===0)return null;if(t.length===1){const a=t[0];return a.href?e.jsxs($,{href:a.href,variant:"body-medium",standalone:!0,className:m.single,children:[e.jsx(p,{src:a.src??"data:,",name:a.name,size:"small",purpose:"decoration"}),a.name]}):e.jsxs("div",{className:m.single,children:[e.jsx(p,{src:a.src??"data:,",name:a.name,size:"small",purpose:"decoration"}),e.jsx(C,{variant:"body-medium",children:a.name})]})}return e.jsx("ul",{className:m.stack,children:t.map((a,i)=>e.jsx("li",{children:e.jsxs(F,{children:[a.href?e.jsx($,{href:a.href,"aria-label":a.name,className:m.avatarLink,children:e.jsx(p,{src:a.src??"data:,",name:a.name,size:"small",purpose:"decoration"})}):e.jsx(Z,{children:e.jsx(p,{src:a.src??"data:,",name:a.name,size:"small",purpose:"informative"})}),e.jsx(J,{children:a.name})]})},a.href??`${i}:${a.name}`))})};l.__docgenInfo={description:`Displays a list of users as avatars inside a Header metadata value.
A single user shows the avatar with their name beside it.
Multiple users show avatars in a row with the name revealed on hover via tooltip.
When a user has an \`href\`, the avatar and name become links.

@public`,methods:[],displayName:"HeaderMetadataUsers",props:{users:{required:!0,tsType:{name:"Array",elements:[{name:"HeaderMetadataUser"}],raw:"HeaderMetadataUser[]"},description:""}}};const te="_single_iq2oy_20",se="_dot_iq2oy_27",W={single:te,dot:se,"dot-danger":"_dot-danger_iq2oy_34","dot-warning":"_dot-warning_iq2oy_38","dot-success":"_dot-success_iq2oy_42","dot-info":"_dot-info_iq2oy_46"},_=({label:t,color:a,href:i})=>e.jsxs("div",{className:W.single,children:[e.jsx("span",{"aria-hidden":"true",className:`${W.dot} ${W[`dot-${a}`]}`}),e.jsx(C,{variant:"body-medium",children:i?e.jsx($,{href:i,standalone:!0,children:t}):t})]});_.__docgenInfo={description:`Displays a single status indicator as a coloured dot with a label inside a
Header metadata value. Optionally renders the label as a link when href is provided.

@public`,methods:[],displayName:"HeaderMetadataStatus",props:{label:{required:!0,tsType:{name:"string"},description:""},color:{required:!0,tsType:{name:"union",raw:"'danger' | 'warning' | 'success' | 'info'",elements:[{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"},{name:"literal",value:"'info'"}]},description:""},href:{required:!1,tsType:{name:"string"},description:""}}};const o=O.meta({title:"Backstage UI/Header",component:c,parameters:{layout:"fullscreen"}}),D=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],oe=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],n=t=>e.jsx(I,{initialEntries:["/overview"],children:e.jsx(R,{children:e.jsx(t,{})})}),s=o.story({args:{title:"Page Title"}}),b=o.story({decorators:[n],args:{...s.input.args,tabs:D}}),g=o.story({decorators:[n],render:()=>e.jsx(c,{...s.input.args,customActions:e.jsxs(e.Fragment,{children:[e.jsx(B,{children:"Custom action"}),e.jsxs(Q,{children:[e.jsx(Y,{variant:"tertiary",icon:e.jsx(K,{}),"aria-label":"More options"}),e.jsx(V,{placement:"bottom end",children:oe.map(t=>e.jsx(X,{onAction:t.onClick,href:t.href,children:t.label},t.value))})]})]})})}),h=o.story({decorators:[n],args:{...s.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),f=o.story({decorators:[n],args:{...s.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),v=o.story({decorators:[n],args:{...s.input.args,description:"This is a description of the page. It can include [inline links](https://backstage.io)."}}),y=o.story({decorators:[n],args:{...s.input.args,tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"},{label:"Gold"}]}}),x=o.story({decorators:[n],args:{...s.input.args,metadata:[{label:"Owner",value:"platform-team"},{label:"Type",value:"website"}]}}),r={giles:{name:"Giles Peyton-Nicoll",src:"https://i.pravatar.cc/150?u=giles",href:"/users/giles"},alice:{name:"Alice Johnson",src:"https://i.pravatar.cc/150?u=alicej",href:"/users/alice"},bob:{name:"Bob Smith",src:"https://i.pravatar.cc/150?u=bob",href:"/users/bob"},carol:{name:"Carol Williams",src:"https://i.pravatar.cc/150?u=carol",href:"/users/carol"}},w=o.story({decorators:[n],render:()=>e.jsx(c,{...s.input.args,metadata:[{label:"Owner",value:e.jsx(l,{users:[r.giles]})},{label:"Contributors",value:e.jsx(l,{users:[r.alice,r.bob,r.carol]})}]})}),j=o.story({decorators:[n],render:()=>e.jsx(c,{...s.input.args,metadata:[{label:"Owner",value:e.jsx(l,{users:[{name:r.giles.name,src:r.giles.src}]})},{label:"Contributors",value:e.jsx(l,{users:[{name:r.alice.name,src:r.alice.src},{name:r.bob.name,src:r.bob.src},{name:r.carol.name,src:r.carol.src}]})}]})}),T=o.story({decorators:[n],render:()=>e.jsx(c,{...s.input.args,metadata:[{label:"Status",value:e.jsx(_,{label:"Passing",color:"success"})},{label:"Build",value:e.jsx(_,{label:"Failed",color:"danger",href:"/builds/123"})},{label:"Coverage",value:e.jsx(_,{label:"Warning",color:"warning"})}]})}),M=o.story({decorators:[n],render:()=>e.jsx(c,{...s.input.args,description:"This is a description of the page. It can include [inline links](https://backstage.io).",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"},{label:"Gold"}],metadata:[{label:"Owner",value:e.jsx(l,{users:[r.giles]})},{label:"Contributors",value:e.jsx(l,{users:[r.alice,r.bob,r.carol]})},{label:"Type",value:"website"},{label:"Tier",value:"gold"}]})}),k=o.story({decorators:[n],render:()=>e.jsx(c,{...s.input.args,tabs:D,customActions:e.jsx(B,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}],description:"This is a description of the page. It can include [inline links](https://backstage.io).",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"},{label:"Gold"}],metadata:[{label:"Type",value:"website"},{label:"Owner",value:e.jsx(l,{users:[r.giles]})},{label:"Contributors",value:e.jsx(l,{users:[r.alice,r.bob,r.carol]})}]})}),ne=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],H=o.story({decorators:[t=>e.jsx(I,{initialEntries:["/docs"],children:e.jsx(R,{children:e.jsx(t,{})})})],args:{...s.input.args,tabs:ne}}),S=o.story({decorators:[n],args:{...s.input.args,tabs:D,activeTabId:"campaigns"}});s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Page Title'
  }
})`,...s.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs
  }
})`,...b.input.parameters?.docs?.source}}};g.input.parameters={...g.input.parameters,docs:{...g.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...g.input.parameters?.docs?.source}}};h.input.parameters={...h.input.parameters,docs:{...h.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }]
  }
})`,...h.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...f.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    description: 'This is a description of the page. It can include [inline links](https://backstage.io).'
  }
})`,...v.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tags: [{
      label: 'TypeScript'
    }, {
      label: 'Platform',
      href: '/platform'
    }, {
      label: 'Gold'
    }]
  }
})`,...y.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    metadata: [{
      label: 'Owner',
      value: 'platform-team'
    }, {
      label: 'Type',
      value: 'website'
    }]
  }
})`,...x.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} metadata={[{
    label: 'Owner',
    value: <HeaderMetadataUsers users={[users.giles]} />
  }, {
    label: 'Contributors',
    value: <HeaderMetadataUsers users={[users.alice, users.bob, users.carol]} />
  }]} />
})`,...w.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} metadata={[{
    label: 'Owner',
    value: <HeaderMetadataUsers users={[{
      name: users.giles.name,
      src: users.giles.src
    }]} />
  }, {
    label: 'Contributors',
    value: <HeaderMetadataUsers users={[{
      name: users.alice.name,
      src: users.alice.src
    }, {
      name: users.bob.name,
      src: users.bob.src
    }, {
      name: users.carol.name,
      src: users.carol.src
    }]} />
  }]} />
})`,...j.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} metadata={[{
    label: 'Status',
    value: <HeaderMetadataStatus label="Passing" color="success" />
  }, {
    label: 'Build',
    value: <HeaderMetadataStatus label="Failed" color="danger" href="/builds/123" />
  }, {
    label: 'Coverage',
    value: <HeaderMetadataStatus label="Warning" color="warning" />
  }]} />
})`,...T.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} description="This is a description of the page. It can include [inline links](https://backstage.io)." tags={[{
    label: 'TypeScript'
  }, {
    label: 'Platform',
    href: '/platform'
  }, {
    label: 'Gold'
  }]} metadata={[{
    label: 'Owner',
    value: <HeaderMetadataUsers users={[users.giles]} />
  }, {
    label: 'Contributors',
    value: <HeaderMetadataUsers users={[users.alice, users.bob, users.carol]} />
  }, {
    label: 'Type',
    value: 'website'
  }, {
    label: 'Tier',
    value: 'gold'
  }]} />
})`,...M.input.parameters?.docs?.source}}};k.input.parameters={...k.input.parameters,docs:{...k.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} tabs={tabs} customActions={<Button>Custom action</Button>} breadcrumbs={[{
    label: 'Home',
    href: '/'
  }]} description="This is a description of the page. It can include [inline links](https://backstage.io)." tags={[{
    label: 'TypeScript'
  }, {
    label: 'Platform',
    href: '/platform'
  }, {
    label: 'Gold'
  }]} metadata={[{
    label: 'Type',
    value: 'website'
  }, {
    label: 'Owner',
    value: <HeaderMetadataUsers users={[users.giles]} />
  }, {
    label: 'Contributors',
    value: <HeaderMetadataUsers users={[users.alice, users.bob, users.carol]} />
  }]} />
})`,...k.input.parameters?.docs?.source}}};H.input.parameters={...H.input.parameters,docs:{...H.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [(Story: StoryFn) => <MemoryRouter initialEntries={['/docs']}>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>],
  args: {
    ...Default.input.args,
    tabs: groupedTabs
  }
})`,...H.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs,
    activeTabId: 'campaigns'
  }
})`,...S.input.parameters?.docs?.source}}};const ca=["Default","WithTabs","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithDescription","WithTags","WithMetadata","WithMetadataUsers","WithMetadataUsersNoLinks","WithMetadataStatus","WithDescriptionTagsAndMetadata","WithEverything","WithGroupedTabs","WithExplicitActiveTab"];export{s as Default,h as WithBreadcrumbs,g as WithCustomActions,v as WithDescription,M as WithDescriptionTagsAndMetadata,k as WithEverything,S as WithExplicitActiveTab,H as WithGroupedTabs,f as WithLongBreadcrumbs,x as WithMetadata,T as WithMetadataStatus,w as WithMetadataUsers,j as WithMetadataUsersNoLinks,b as WithTabs,y as WithTags,ca as __namedExportsOrder};
