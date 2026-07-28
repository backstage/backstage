import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-X5mwL4tp.js";import{P as l}from"./PluginHeader--iHFn_sQ.js";import{C as p}from"./Container-B5U1efQw.js";import{T as t}from"./Text-DuxikEFP.js";import{B as j}from"./BUIProvider-gHi16S2c.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BaDW95zO.js";import"./utils-DbglA0qc.js";import"./useObjectRef-B4ikIkxr.js";import"./useCollection-D6kXv1i_.js";import"./useFocusRing-C-qV4ltP.js";import"./openLink-iaf6h5Vg.js";import"./Hidden-DXcGagMc.js";import"./keyboard-SH1FHugW.js";import"./FocusScope-ChrxsfV7.js";import"./useEvent-B9gIp-0I.js";import"./I18nProvider-Cp8YwWQe.js";import"./usePress-C87_1f3H.js";import"./textSelection-DtJZPEXI.js";import"./useControlledState-VUJiIP94.js";import"./Link-DxkbamJ8.js";import"./useLink-DCoD8_Dq.js";import"./useHover-iQz_in6H.js";import"./useLocalizedStringFormatter-DJopSl5i.js";import"./Button-Mr7_7LVv.js";import"./Label-Du0ObhKE.js";import"./useLabel-DttWp7u_.js";import"./useLabels-CyId-J7Z.js";import"./number-BgaIE-sV.js";import"./useButton-b3MTXzJF.js";import"./Menu-uIwgOfaV.js";import"./Autocomplete-DZgLERJG.js";import"./getItemCount-CCMQjwsk.js";import"./Input-DJuIrIG0.js";import"./ListBox-Dw_6YJ7x.js";import"./Text-D1k2Dp8f.js";import"./useListState-Dtv5tBCM.js";import"./Dialog-hwZzxVwX.js";import"./Heading-BUx8lHFH.js";import"./useOverlayTriggerState-DadPaReJ.js";import"./VisuallyHidden-D2nFrwYc.js";import"./animation-DwrFgyaB.js";import"./SearchField-CFnfufPI.js";import"./FieldError-D3Li39rU.js";import"./useFormValidation-hr5mEY2s.js";import"./useTextField-DinD4WeQ.js";import"./useField-O4p38GKT.js";import"./useFormReset-DGDQjoCT.js";import"./Virtualizer-u-9zRlic.js";import"./useFilter-CVSTsY3u.js";import"./getNodeText-DuOZZozu.js";import"./Link-CZ0KstPM.js";import"./useResolvedHref-v0hr4wbk.js";import"./Tooltip-Be8BRkWP.js";import"./VisuallyHidden-BOKQKcpm.js";import"./Tabs-BtnaCW2E.js";import"./useHasTabbableChild-C5XMTkeT.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=f.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...o.input.parameters?.docs?.source}}};a.input.parameters={...a.input.parameters,docs:{...a.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...a.input.parameters?.docs?.source}}};s.input.parameters={...s.input.parameters,docs:{...s.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const ke=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,ke as __namedExportsOrder};
