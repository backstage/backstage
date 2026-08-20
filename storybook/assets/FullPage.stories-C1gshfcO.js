import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-BHoENCVc.js";import{P as l}from"./PluginHeader-B8w_MmbZ.js";import{C as p}from"./Container-BI5sntRL.js";import{T as t}from"./Text-s-AhUfle.js";import{B as j}from"./BUIProvider-BqojK_vt.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CXAyTdUW.js";import"./utils-CL0Z8V1C.js";import"./useObjectRef-uSeYP5xn.js";import"./useCollection-CvCJeEFX.js";import"./useFocusRing-MHb5XFUp.js";import"./openLink-DZP0UHC7.js";import"./Hidden-C6_e4Tzz.js";import"./keyboard-CQek5qZh.js";import"./FocusScope-9n4xhBQA.js";import"./useEvent-CcBfYwbm.js";import"./I18nProvider-BHwrJH4v.js";import"./usePress-D96lUmWf.js";import"./textSelection-Di8U28Mz.js";import"./useControlledState--Wz_vfvx.js";import"./Link-DAHHsGVg.js";import"./useLink-DHP2JBzs.js";import"./useHover-CPCQZiGU.js";import"./useLocalizedStringFormatter-BaNttnCu.js";import"./Button-BHRDpgL_.js";import"./Label-DlD4XAby.js";import"./useLabel-DLz-9M9H.js";import"./useLabels-Dx4Y77vh.js";import"./number-CnfK_WTv.js";import"./useButton-DPa3LWsd.js";import"./Menu-xKZm1HVK.js";import"./Autocomplete-Bgw_Gpoz.js";import"./getItemCount-CZxrPbgG.js";import"./Input-BO0IQHQF.js";import"./ListBox-A5L7mExS.js";import"./Text-C8x2cVH5.js";import"./useListState-vDCPlgz-.js";import"./Dialog-Dl2D-CV-.js";import"./Heading-BT5dE8Rd.js";import"./useOverlayTriggerState-Cx2c-3-p.js";import"./VisuallyHidden-q8nayOEv.js";import"./animation-D48GeWFv.js";import"./SearchField-D81loRcG.js";import"./FieldError-ByCYa549.js";import"./useFormValidation-BwtogCRU.js";import"./useTextField-DggYGt4Z.js";import"./useField-DUlTbCPt.js";import"./useFormReset-lwOM45Sr.js";import"./Virtualizer-DblGK9ID.js";import"./useFilter-L39FFgK3.js";import"./getNodeText-DSCCppXL.js";import"./Link-nwVQbPsP.js";import"./useResolvedHref-KjDbaJ0G.js";import"./Tooltip-DzM1tQjG.js";import"./VisuallyHidden-8ggLrWdc.js";import"./Tabs-CreFye_P.js";import"./useHasTabbableChild-CvGSNzkq.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
