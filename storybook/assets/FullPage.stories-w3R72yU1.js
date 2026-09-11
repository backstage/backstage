import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-CJeP2vvm.js";import{P as l}from"./PluginHeader-ik3TdsEN.js";import{C as p}from"./Container-DYZ-jlqw.js";import{T as t}from"./Text-CPKESXCj.js";import{B as j}from"./BUIProvider-Di2647ue.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DyrFOjzE.js";import"./utils-Ci9aOot6.js";import"./useObjectRef-C-2dJx3K.js";import"./useCollection-DC2dMXw2.js";import"./useFocusRing-o6_0h1DB.js";import"./openLink-Dw-jVqrV.js";import"./Hidden-BDNd3cL9.js";import"./keyboard-C_4fFDAk.js";import"./FocusScope-CrvxcrnB.js";import"./useEvent-BeGsBTLg.js";import"./I18nProvider-C7P3l0dN.js";import"./usePress-BBcvFLiN.js";import"./textSelection-C5htZZfI.js";import"./useControlledState-CqCclfwn.js";import"./Link-S-PQKJDu.js";import"./useLink-KUW3grrP.js";import"./useHover-Bg3BX-Db.js";import"./useLocalizedStringFormatter-r6ayiQJa.js";import"./Button-BDYf5QxC.js";import"./Label-D4bUC6Na.js";import"./useLabel-CmJz89mn.js";import"./useLabels-DRlool0j.js";import"./number-BSFxjcvW.js";import"./useButton-DUAdcx1U.js";import"./Menu-Cayzd004.js";import"./Autocomplete-Diq8wjE-.js";import"./getItemCount-CQducLSl.js";import"./Input-Bc46tetu.js";import"./ListBox-CKRVhzwU.js";import"./Text-BA3ToQdd.js";import"./useListState-0lDpe9Bc.js";import"./Dialog-b1MBRoD8.js";import"./Heading-CnACen_l.js";import"./useOverlayTriggerState-Drctaywp.js";import"./VisuallyHidden-CZOHUozB.js";import"./animation-CvMuFemQ.js";import"./SearchField-szVf4cR5.js";import"./FieldError-BkU6JVez.js";import"./useFormValidation-CBxiIw6I.js";import"./useTextField-l2U9Rhdp.js";import"./useField-CAcKkVb1.js";import"./useFormReset-D_rWU48j.js";import"./Virtualizer-D4H0wlTz.js";import"./useFilter-Bmm0OXbb.js";import"./getNodeText-C5gCN7en.js";import"./Link-DSPu5_u6.js";import"./useResolvedHref-DW2cHm9P.js";import"./Tooltip-DzyZsiuV.js";import"./VisuallyHidden-zMmMIbZt.js";import"./Tabs-DmbJ-DhF.js";import"./useHasTabbableChild-DepQXm0Q.js";import"./BUIRoutingProvider-B_ktoSaA.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
