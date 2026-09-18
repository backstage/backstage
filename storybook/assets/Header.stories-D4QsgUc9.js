import{S as u,c8 as G,bQ as e,w as $,c5 as F}from"./iframe-CdNUyns1.js";import{H as l}from"./Header-BqRJsqek.js";import{$ as z,c as V,e as J}from"./useObjectRef-CFuPSG1M.js";import{b as Q}from"./usePress-_7EGmIU1.js";import{B as K}from"./useFocusRing-BuKVGuQV.js";import{L as D}from"./Link-Dm64VgEr.js";import{A as m}from"./Avatar-CwET3TVw.js";import{T as O}from"./Text-FxBj8Ix2.js";import{a as X,T as Y}from"./Tooltip-DtfFdx8E.js";import{V as Z}from"./index-C5_u8aRu.js";import{C as L}from"./Container-CQuT5iZb.js";import{h as ee,M as te,c as ae}from"./Menu-CLjOauqu.js";import{B as U}from"./BUIProvider-BJ06Zhnc.js";import{B as p}from"./Button-Do16sCRm.js";import{B as re}from"./ButtonIcon-ZRgf0k-E.js";import"./preload-helper-PPVm8Dsz.js";import"./useHover-Cn5cU9qj.js";import"./useLink-Dpm6epyW.js";import"./openLink-DihNKPlJ.js";import"./Button-Cb98tIb7.js";import"./utils-B3O2Yp_M.js";import"./Label-D16an-mE.js";import"./Hidden-CS8th6sD.js";import"./useLabel-BERv6pEw.js";import"./useLabels-uizblfZx.js";import"./number-CzhiuJx7.js";import"./I18nProvider-B6FBVrT9.js";import"./useButton-BtcENp-V.js";import"./textSelection-SXrH1sR5.js";import"./useResolvedHref-CfjkVgWI.js";import"./getNodeText-CJDdWeRh.js";import"./useOverlayTriggerState-CxgiGkff.js";import"./useControlledState-BN5fLvZ3.js";import"./animation-Dtm5YrM0.js";import"./Autocomplete-BkQbc6kZ.js";import"./keyboard-DKfMEpD_.js";import"./useEvent-CUxtDg7f.js";import"./useLocalizedStringFormatter-qf--bxfb.js";import"./getItemCount-ZzIrozYJ.js";import"./useCollection-lN1Q5AFU.js";import"./FocusScope-BGoJKhy8.js";import"./Input-CfbbQHzS.js";import"./ListBox-B_d110hq.js";import"./Text-CYsN3RIY.js";import"./useListState-736NwSrE.js";import"./Dialog-MeAFG64o.js";import"./Heading-CslegC5L.js";import"./VisuallyHidden-B5fHw0hs.js";import"./SearchField-DaycyAjt.js";import"./FieldError-CdWPta5W.js";import"./useFormValidation-DRFEp6qp.js";import"./useTextField-CRnA5sL5.js";import"./useField-CmzNUn8V.js";import"./useFormReset-BRZSsq_e.js";import"./Virtualizer-Bhbo0TE3.js";import"./useFilter-C3vSSGtB.js";import"./BUIRoutingProvider-DGbwW94E.js";const se=u.forwardRef(({children:a,...t},n)=>{n=z(n);let{pressProps:N}=Q({...t,ref:n}),{focusableProps:E}=K(t,n),d=u.Children.only(a);G.useEffect(()=>{},[n,t.isDisabled]);let q=parseInt(u.version,10)<19?d.ref:d.props.ref;return u.cloneElement(d,{...J(N,E,d.props),ref:V(q,n)})}),oe="_single_1dmyt_20",ie="_stack_1dmyt_27",ne="_avatarLink_1dmyt_37",h={single:oe,stack:ie,avatarLink:ne},c=({users:a})=>{if(a.length===0)return null;if(a.length===1){const t=a[0];return t.href?e.jsxs(D,{href:t.href,variant:"body-medium",standalone:!0,className:h.single,children:[e.jsx(m,{src:t.src??"data:,",name:t.name,size:"small",purpose:"decoration"}),t.name]}):e.jsxs("div",{className:h.single,children:[e.jsx(m,{src:t.src??"data:,",name:t.name,size:"small",purpose:"decoration"}),e.jsx(O,{variant:"body-medium",children:t.name})]})}return e.jsx("ul",{className:h.stack,children:a.map((t,n)=>e.jsx("li",{children:e.jsxs(X,{children:[t.href?e.jsx(D,{href:t.href,"aria-label":t.name,className:h.avatarLink,children:e.jsx(m,{src:t.src??"data:,",name:t.name,size:"small",purpose:"decoration"})}):e.jsx(se,{children:e.jsx(m,{src:t.src??"data:,",name:t.name,size:"small",purpose:"informative"})}),e.jsx(Y,{children:t.name})]})},t.href??`${n}:${t.name}`))})};c.__docgenInfo={description:`Displays a list of users as avatars inside a Header metadata value.
A single user shows the avatar with their name beside it.
Multiple users show avatars in a row with the name revealed on hover via tooltip.
When a user has an \`href\`, the avatar and name become links.

@public`,methods:[],displayName:"HeaderMetadataUsers",props:{users:{required:!0,tsType:{name:"Array",elements:[{name:"HeaderMetadataUser"}],raw:"HeaderMetadataUser[]"},description:""}}};const le="_single_iq2oy_20",ce="_dot_iq2oy_27",R={single:le,dot:ce,"dot-danger":"_dot-danger_iq2oy_34","dot-warning":"_dot-warning_iq2oy_38","dot-success":"_dot-success_iq2oy_42","dot-info":"_dot-info_iq2oy_46"},P=({label:a,color:t,href:n})=>e.jsxs("div",{className:R.single,children:[e.jsx("span",{"aria-hidden":"true",className:`${R.dot} ${R[`dot-${t}`]}`}),e.jsx(O,{variant:"body-medium",children:n?e.jsx(D,{href:n,standalone:!0,children:a}):a})]});P.__docgenInfo={description:`Displays a single status indicator as a colored dot with a label inside a
Header metadata value. Optionally renders the label as a link when href is provided.

@public`,methods:[],displayName:"HeaderMetadataStatus",props:{label:{required:!0,tsType:{name:"string"},description:""},color:{required:!0,tsType:{name:"union",raw:"'danger' | 'warning' | 'success' | 'info'",elements:[{name:"literal",value:"'danger'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'success'"},{name:"literal",value:"'info'"}]},description:""},href:{required:!1,tsType:{name:"string"},description:""}}};const s=F.meta({title:"Backstage UI/Header",component:l,parameters:{layout:"fullscreen"}}),I=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"},{id:"integrations",label:"Integrations",href:"/integrations"}],pe=[{label:"Settings",value:"settings",href:"/settings"},{label:"Invite new members",value:"invite-new-members",href:"/invite-new-members"},{label:"Logout",value:"logout",onClick:()=>{alert("logout")}}],i=a=>e.jsx($,{initialEntries:["/overview"],children:e.jsx(U,{children:e.jsx(a,{})})}),o=s.story({args:{title:"Page Title"}}),b=s.story({decorators:[i],args:{...o.input.args,tabs:I}}),g=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,customActions:e.jsxs(e.Fragment,{children:[e.jsx(p,{children:"Custom action"}),e.jsxs(ee,{children:[e.jsx(re,{variant:"tertiary",icon:e.jsx(Z,{}),"aria-label":"More options"}),e.jsx(te,{placement:"bottom end",children:pe.map(a=>e.jsx(ae,{onAction:a.onClick,href:a.href,children:a.label},a.value))})]})]})})}),f=s.story({decorators:[i],args:{...o.input.args,breadcrumbs:[{label:"Home",href:"/"}]}}),y=s.story({decorators:[i],args:{...o.input.args,breadcrumbs:[{label:"Home",href:"/"},{label:"Long Breadcrumb Name",href:"/long-breadcrumb"}]}}),w=s.story({decorators:[i],args:{...o.input.args,description:"This is a description of the page. It can include [inline links](https://backstage.io)."}}),v=s.story({decorators:[i],args:{...o.input.args,tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"},{label:"Gold"}]}}),x=s.story({decorators:[i],args:{...o.input.args,metadata:[{label:"Owner",value:"platform-team"},{label:"Type",value:"website"}]}}),r={giles:{name:"Giles Peyton-Nicoll",src:"https://i.pravatar.cc/150?u=giles",href:"/users/giles"},alice:{name:"Alice Johnson",src:"https://i.pravatar.cc/150?u=alicej",href:"/users/alice"},bob:{name:"Bob Smith",src:"https://i.pravatar.cc/150?u=bob",href:"/users/bob"},carol:{name:"Carol Williams",src:"https://i.pravatar.cc/150?u=carol",href:"/users/carol"}},T=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,metadata:[{label:"Owner",value:e.jsx(c,{users:[r.giles]})},{label:"Contributors",value:e.jsx(c,{users:[r.alice,r.bob,r.carol]})}]})}),k=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,metadata:[{label:"Owner",value:e.jsx(c,{users:[{name:r.giles.name,src:r.giles.src}]})},{label:"Contributors",value:e.jsx(c,{users:[{name:r.alice.name,src:r.alice.src},{name:r.bob.name,src:r.bob.src},{name:r.carol.name,src:r.carol.src}]})}]})}),j=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,metadata:[{label:"Status",value:e.jsx(P,{label:"Passing",color:"success"})},{label:"Build",value:e.jsx(P,{label:"Failed",color:"danger",href:"/builds/123"})},{label:"Coverage",value:e.jsx(P,{label:"Warning",color:"warning"})}]})}),S=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,description:"This is a description of the page. It can include [inline links](https://backstage.io).",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"},{label:"Gold"}],metadata:[{label:"Owner",value:e.jsx(c,{users:[r.giles]})},{label:"Contributors",value:e.jsx(c,{users:[r.alice,r.bob,r.carol]})},{label:"Type",value:"website"},{label:"Tier",value:"gold"}]})}),B=s.story({decorators:[i],render:()=>e.jsx(l,{...o.input.args,tabs:I,customActions:e.jsx(p,{children:"Custom action"}),breadcrumbs:[{label:"Home",href:"/"}],description:"This is a description of the page. It can include [inline links](https://backstage.io).",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"},{label:"Gold"}],metadata:[{label:"Type",value:"website"},{label:"Owner",value:e.jsx(c,{users:[r.giles]})},{label:"Contributors",value:e.jsx(c,{users:[r.alice,r.bob,r.carol]})}]})}),de=[{id:"overview",label:"Overview",href:"/overview"},{id:"docs-group",label:"Documentation",items:[{id:"docs",label:"TechDocs",href:"/docs"},{id:"api-docs",label:"API Reference",href:"/api-docs"}]},{id:"ci",label:"CI/CD",href:"/ci"}],M=s.story({decorators:[a=>e.jsx($,{initialEntries:["/docs"],children:e.jsx(U,{children:e.jsx(a,{})})})],args:{...o.input.args,tabs:de}}),C=s.story({decorators:[i],args:{...o.input.args,tabs:I,activeTabId:"campaigns"}}),H=s.story({decorators:[i],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"Sticky Page Title",description:"This is a description of the page that scrolls away when you scroll down.",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"}],metadata:[{label:"Owner",value:"platform-team"},{label:"Type",value:"website"}],customActions:e.jsx(p,{children:"Custom action"})}),e.jsx(L,{pb:"3",children:Array.from({length:60},(a,t)=>e.jsxs("p",{style:{marginBottom:"16px"},children:["Scroll down to see the entire header scroll away with the rest of the page content. Line ",t+1,"."]},t))})]})}),_=s.story({decorators:[i],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"Sticky Page Title",sticky:!0,description:"This is a description of the page that scrolls away when you scroll down.",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"}],metadata:[{label:"Owner",value:"platform-team"},{label:"Type",value:"website"}],customActions:e.jsx(p,{children:"Custom action"})}),e.jsx(L,{pb:"3",children:Array.from({length:60},(a,t)=>e.jsxs("p",{style:{marginBottom:"16px"},children:["Scroll down to see the title bar stick to the top while the tags, description, and metadata scroll away. Line ",t+1,"."]},t))})]})}),A=s.story({decorators:[i],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"This is a very long page title that should demonstrate how the sticky Header behaves when the title takes up significantly more horizontal space than usual",sticky:!0,description:"This is a description of the page that scrolls away when you scroll down.",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"}],metadata:[{label:"Owner",value:"platform-team"},{label:"Type",value:"website"}],customActions:e.jsx(p,{children:"Custom action"})}),e.jsx(L,{pb:"3",children:Array.from({length:60},(a,t)=>e.jsxs("p",{style:{marginBottom:"16px"},children:["Scroll down to see the long title bar stick to the top while the tags, description, and metadata scroll away. Line ",t+1,"."]},t))})]})}),W=s.story({decorators:[i],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"This is a very long page title that should demonstrate how sticky breadcrumbs and titles behave when both need to fit in the compact stuck state",sticky:!0,breadcrumbs:[{label:"Home",href:"/"},{label:"Very Long Breadcrumb Name",href:"/long-breadcrumb"}],description:"This is a description of the page that scrolls away when you scroll down.",tags:[{label:"TypeScript"},{label:"Platform",href:"/platform"}],metadata:[{label:"Owner",value:"platform-team"},{label:"Type",value:"website"}],customActions:e.jsx(p,{children:"Custom action"})}),e.jsx(L,{pb:"3",children:Array.from({length:60},(a,t)=>e.jsxs("p",{style:{marginBottom:"16px"},children:["Scroll down to see the breadcrumb and long title bar stick to the top while the tags, description, and metadata scroll away. Line"," ",t+1,"."]},t))})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  args: {
    title: 'Page Title'
  }
})`,...o.input.parameters?.docs?.source}}};b.input.parameters={...b.input.parameters,docs:{...b.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...g.input.parameters?.docs?.source}}};f.input.parameters={...f.input.parameters,docs:{...f.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    breadcrumbs: [{
      label: 'Home',
      href: '/'
    }]
  }
})`,...f.input.parameters?.docs?.source}}};y.input.parameters={...y.input.parameters,docs:{...y.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...y.input.parameters?.docs?.source}}};w.input.parameters={...w.input.parameters,docs:{...w.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    description: 'This is a description of the page. It can include [inline links](https://backstage.io).'
  }
})`,...w.input.parameters?.docs?.source}}};v.input.parameters={...v.input.parameters,docs:{...v.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...v.input.parameters?.docs?.source}}};x.input.parameters={...x.input.parameters,docs:{...x.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...x.input.parameters?.docs?.source}}};T.input.parameters={...T.input.parameters,docs:{...T.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <Header {...Default.input.args} metadata={[{
    label: 'Owner',
    value: <HeaderMetadataUsers users={[users.giles]} />
  }, {
    label: 'Contributors',
    value: <HeaderMetadataUsers users={[users.alice, users.bob, users.carol]} />
  }]} />
})`,...T.input.parameters?.docs?.source}}};k.input.parameters={...k.input.parameters,docs:{...k.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...k.input.parameters?.docs?.source}}};j.input.parameters={...j.input.parameters,docs:{...j.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...j.input.parameters?.docs?.source}}};S.input.parameters={...S.input.parameters,docs:{...S.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...S.input.parameters?.docs?.source}}};B.input.parameters={...B.input.parameters,docs:{...B.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...B.input.parameters?.docs?.source}}};M.input.parameters={...M.input.parameters,docs:{...M.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [(Story: StoryFn) => <MemoryRouter initialEntries={['/docs']}>
        <BUIProvider>
          <Story />
        </BUIProvider>
      </MemoryRouter>],
  args: {
    ...Default.input.args,
    tabs: groupedTabs
  }
})`,...M.input.parameters?.docs?.source}}};C.input.parameters={...C.input.parameters,docs:{...C.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  args: {
    ...Default.input.args,
    tabs,
    activeTabId: 'campaigns'
  }
})`,...C.input.parameters?.docs?.source}}};H.input.parameters={...H.input.parameters,docs:{...H.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <Header title="Sticky Page Title" description="This is a description of the page that scrolls away when you scroll down." tags={[{
      label: 'TypeScript'
    }, {
      label: 'Platform',
      href: '/platform'
    }]} metadata={[{
      label: 'Owner',
      value: 'platform-team'
    }, {
      label: 'Type',
      value: 'website'
    }]} customActions={<Button>Custom action</Button>} />
      <Container pb="3">
        {Array.from({
        length: 60
      }, (_, i) => <p key={i} style={{
        marginBottom: '16px'
      }}>
            Scroll down to see the entire header scroll away with the rest of
            the page content. Line {i + 1}.
          </p>)}
      </Container>
    </>
})`,...H.input.parameters?.docs?.source}}};_.input.parameters={..._.input.parameters,docs:{..._.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <Header title="Sticky Page Title" sticky description="This is a description of the page that scrolls away when you scroll down." tags={[{
      label: 'TypeScript'
    }, {
      label: 'Platform',
      href: '/platform'
    }]} metadata={[{
      label: 'Owner',
      value: 'platform-team'
    }, {
      label: 'Type',
      value: 'website'
    }]} customActions={<Button>Custom action</Button>} />
      <Container pb="3">
        {Array.from({
        length: 60
      }, (_, i) => <p key={i} style={{
        marginBottom: '16px'
      }}>
            Scroll down to see the title bar stick to the top while the tags,
            description, and metadata scroll away. Line {i + 1}.
          </p>)}
      </Container>
    </>
})`,..._.input.parameters?.docs?.source}}};A.input.parameters={...A.input.parameters,docs:{...A.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <Header title="This is a very long page title that should demonstrate how the sticky Header behaves when the title takes up significantly more horizontal space than usual" sticky description="This is a description of the page that scrolls away when you scroll down." tags={[{
      label: 'TypeScript'
    }, {
      label: 'Platform',
      href: '/platform'
    }]} metadata={[{
      label: 'Owner',
      value: 'platform-team'
    }, {
      label: 'Type',
      value: 'website'
    }]} customActions={<Button>Custom action</Button>} />
      <Container pb="3">
        {Array.from({
        length: 60
      }, (_, i) => <p key={i} style={{
        marginBottom: '16px'
      }}>
            Scroll down to see the long title bar stick to the top while the
            tags, description, and metadata scroll away. Line {i + 1}.
          </p>)}
      </Container>
    </>
})`,...A.input.parameters?.docs?.source}}};W.input.parameters={...W.input.parameters,docs:{...W.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <Header title="This is a very long page title that should demonstrate how sticky breadcrumbs and titles behave when both need to fit in the compact stuck state" sticky breadcrumbs={[{
      label: 'Home',
      href: '/'
    }, {
      label: 'Very Long Breadcrumb Name',
      href: '/long-breadcrumb'
    }]} description="This is a description of the page that scrolls away when you scroll down." tags={[{
      label: 'TypeScript'
    }, {
      label: 'Platform',
      href: '/platform'
    }]} metadata={[{
      label: 'Owner',
      value: 'platform-team'
    }, {
      label: 'Type',
      value: 'website'
    }]} customActions={<Button>Custom action</Button>} />
      <Container pb="3">
        {Array.from({
        length: 60
      }, (_, i) => <p key={i} style={{
        marginBottom: '16px'
      }}>
            Scroll down to see the breadcrumb and long title bar stick to the
            top while the tags, description, and metadata scroll away. Line{' '}
            {i + 1}.
          </p>)}
      </Container>
    </>
})`,...W.input.parameters?.docs?.source}}};const bt=["Default","WithTabs","WithCustomActions","WithBreadcrumbs","WithLongBreadcrumbs","WithDescription","WithTags","WithMetadata","WithMetadataUsers","WithMetadataUsersNoLinks","WithMetadataStatus","WithDescriptionTagsAndMetadata","WithEverything","WithGroupedTabs","WithExplicitActiveTab","NonSticky","Sticky","StickyWithLongTitle","StickyWithBreadcrumbsAndLongTitle"];export{o as Default,H as NonSticky,_ as Sticky,W as StickyWithBreadcrumbsAndLongTitle,A as StickyWithLongTitle,f as WithBreadcrumbs,g as WithCustomActions,w as WithDescription,S as WithDescriptionTagsAndMetadata,B as WithEverything,C as WithExplicitActiveTab,M as WithGroupedTabs,y as WithLongBreadcrumbs,x as WithMetadata,j as WithMetadataStatus,T as WithMetadataUsers,k as WithMetadataUsersNoLinks,b as WithTabs,v as WithTags,bt as __namedExportsOrder};
