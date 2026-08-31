import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-D3gHomOk.js";import{P as l}from"./PluginHeader-DuGnBtYj.js";import{C as p}from"./Container-CO0x04ba.js";import{T as t}from"./Text-nVMuxvjC.js";import{B as j}from"./BUIProvider-Bxr4G_Rv.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CIObmbyT.js";import"./utils--jiZfpYa.js";import"./useObjectRef-hXxbhaat.js";import"./useCollection-CcQg7U7w.js";import"./useFocusRing-DHt_dYoo.js";import"./openLink-BpYvnjEr.js";import"./Hidden-CXwBcFFN.js";import"./keyboard-XkEo6qi_.js";import"./FocusScope-l3B1Tt6B.js";import"./useEvent-9StB23wA.js";import"./I18nProvider-Bras-Ck8.js";import"./usePress-CVpxTLfU.js";import"./textSelection-NP_j1vUN.js";import"./useControlledState-fmlyVL5h.js";import"./Link-DaXg6uK1.js";import"./useLink-D9BJiihX.js";import"./useHover-ZdERZDwl.js";import"./useLocalizedStringFormatter-zPjMhKe2.js";import"./Button-Cu1Zpd0O.js";import"./Label-CAWIGhje.js";import"./useLabel-W6Ub3U1-.js";import"./useLabels-DMTWiEER.js";import"./number-L24Dz_3k.js";import"./useButton-BQFf-KYE.js";import"./Menu-B9xaQo5b.js";import"./Autocomplete-kr6thEjl.js";import"./getItemCount-JzJ4DlKD.js";import"./Input-DSlTO14n.js";import"./ListBox-C-HnKv6b.js";import"./Text-CQOWjHmq.js";import"./useListState-CijF9aw-.js";import"./Dialog-BmDk8gAt.js";import"./Heading-BbqFKY1r.js";import"./useOverlayTriggerState-BAAbOSKk.js";import"./VisuallyHidden-CliApQIk.js";import"./animation-BtY6VQj9.js";import"./SearchField-BjeHTVk3.js";import"./FieldError-DZcZSqlY.js";import"./useFormValidation-dBRW7xC2.js";import"./useTextField-DimOsl7G.js";import"./useField-B6xw7g85.js";import"./useFormReset-Dkm8T-fh.js";import"./Virtualizer-DlcQ8KBP.js";import"./useFilter-DogpFwYU.js";import"./getNodeText-lndkpo0Z.js";import"./Link-C9eh4uHS.js";import"./useResolvedHref-F6RORdbO.js";import"./Tooltip-CdsBNNYj.js";import"./VisuallyHidden-BOT5PlJK.js";import"./Tabs-EHnIT3fk.js";import"./useHasTabbableChild-CeS9XjHG.js";import"./BUIRoutingProvider-ClLZP9qs.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage style={{
      backgroundColor: '#c3f0ff'
    }}>
        <Container>
          <Text as="p">
            This content fills the remaining viewport height below the Header.
          </Text>
        </Container>
      </FullPage>
    </>
})`,...o.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" />
      <FullPage>
        <Container>
          <Text as="h2" variant="title-medium">
            Scrollable Content
          </Text>
          <Text as="p">
            The content below scrolls independently while the Header stays
            pinned at the top.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...s.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
  decorators: [withRouter],
  render: () => <>
      <PluginHeader title="My Plugin" tabs={tabs} />
      <FullPage>
        <Container>
          <Text as="p">
            The FullPage height adjusts automatically when the Header includes
            tabs, thanks to the ResizeObserver measuring the Header's actual
            height.
          </Text>
          {paragraphs}
        </Container>
      </FullPage>
    </>
})`,...a.input.parameters?.docs?.source}}};const Se=["Default","WithScrollableContent","WithTabs"];export{o as Default,s as WithScrollableContent,a as WithTabs,Se as __namedExportsOrder};
