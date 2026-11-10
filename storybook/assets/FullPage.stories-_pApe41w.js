import{aN as x,r as b,aO as P,j as e,p as f,M as y}from"./iframe-Q4ctuRUv.js";import{P as l}from"./PluginHeader-vn6abWKY.js";import{C as p}from"./Container-CBUCS6Kh.js";import{T as t}from"./Text-7YMNQ-ID.js";import{B as j}from"./BUIProvider-BGKOs6kd.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B2PZBeFt.js";import"./utils-CTbYSeHd.js";import"./useObjectRef-BFzgzp46.js";import"./useCollection-C2kVYo6V.js";import"./useFocusRing-DiENv1rk.js";import"./openLink-qs0UDoSy.js";import"./Hidden-BhGBloyx.js";import"./keyboard-B0COaPZh.js";import"./getMetaValue-CITejevD.js";import"./FocusScope-DkxVfQOW.js";import"./useEvent-BpVCmMqU.js";import"./I18nProvider-Bsf8nutC.js";import"./usePress-Dnu9apiz.js";import"./textSelection-DMfLw1Y1.js";import"./useControlledState-CGLHX-Pe.js";import"./Link-9pP5Ckse.js";import"./useLink-Dp1gfBvl.js";import"./useHover-B_-Qawkz.js";import"./useLocalizedStringFormatter-C234lHL1.js";import"./Button-j0bKjTfS.js";import"./Label-BJe5bXQU.js";import"./useLabel-UNvbR8sI.js";import"./useLabels-BPBTzwbg.js";import"./number-BhqHD8kO.js";import"./useButton-DgX1muWK.js";import"./Menu-Cozb5n4o.js";import"./Autocomplete-BSvySyXp.js";import"./useLoadMoreSentinel-xrGxrABJ.js";import"./Input-BCq2znLO.js";import"./ListBox-DLEuYnEf.js";import"./SelectionIndicator-Bgb9UEqr.js";import"./Text-YknYtPMS.js";import"./useListState-DMop-JDR.js";import"./Dialog-If40atmp.js";import"./Heading-BwmMR0aZ.js";import"./useOverlayTriggerState-DcH1p3io.js";import"./VisuallyHidden-DMJse-Yp.js";import"./animation-Dqeq4_Vx.js";import"./SearchField-Ck_q9jgm.js";import"./FieldError-D43CsVYe.js";import"./Form-Brw3O52F.js";import"./useFormValidation-DPOCc4Gj.js";import"./useTextField-DQVyUx5t.js";import"./useField-Bjdaztqi.js";import"./useFormReset-Bpe--cgd.js";import"./Virtualizer-CnnPczMm.js";import"./useFilter-uXDYehO-.js";import"./getNodeText-JuafaKO8.js";import"./Link-Dba9x8rC.js";import"./useResolvedHref-CniJI67Y.js";import"./Tooltip-BbHBDYER.js";import"./VisuallyHidden-CPK0XWBm.js";import"./Tabs-Bnx9p8rR.js";import"./useHasTabbableChild-Ce7sBXWn.js";import"./BUIRoutingProvider-D0sMS8E6.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=P(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
})`,...s.input.parameters?.docs?.source}}};const _e=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,_e as __namedExportsOrder};
