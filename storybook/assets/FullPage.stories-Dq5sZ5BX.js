import{aD as x,r as b,aE as f,j as e,p as P}from"./iframe-T196ztmH.js";import{T as y}from"./TestRouter-BJWBQVfh.js";import{P as l}from"./PluginHeader-D75SPNRR.js";import{C as p}from"./Container-Dm41NSMj.js";import{T as t}from"./Text-DHVCUzKH.js";import{B as j}from"./BUIProvider-B84iVJlz.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DQMgTQ6t.js";import"./index-WrKC2aIj.js";import"./utils-zm3gdQCr.js";import"./useObjectRef-_dSsW1Fk.js";import"./useCollection-CgXGU2_i.js";import"./useFocusRing-DNtHiErB.js";import"./Hidden-BBV6Ld8l.js";import"./keyboard-CJkcO-3v.js";import"./getMetaValue-DwQluMyN.js";import"./FocusScope-BHBZvOQT.js";import"./useEvent-Cke3Ncps.js";import"./I18nProvider-DNS4_F5r.js";import"./usePress-C69aPbO8.js";import"./textSelection-BG3cATkn.js";import"./useControlledState-DuQaVgle.js";import"./Link-D5IAvdjk.js";import"./useLink-By6kSMjo.js";import"./useHover-7-pgp0Ky.js";import"./useLocalizedStringFormatter-DlzBfcjg.js";import"./Button-CrpaGjWm.js";import"./Label-sNbExByb.js";import"./useLabel-BnuV1o8f.js";import"./useLabels-Cvihbbwm.js";import"./number-0emrtaiX.js";import"./useButton-vSodW6MB.js";import"./Menu-DPLt9iBP.js";import"./Autocomplete-CjJ_F5TB.js";import"./useLoadMoreSentinel-BYi8Wya9.js";import"./Input-C-xGK98H.js";import"./ListBox-D80kzMkL.js";import"./SelectionIndicator-C6tjeRgq.js";import"./Text-BOLLLJ4X.js";import"./useListState-B1UqO2Kz.js";import"./Dialog-B8P1eJ4A.js";import"./Heading-VKMd5v1x.js";import"./useOverlayTriggerState-D9Xb0gJN.js";import"./VisuallyHidden-Bk28NlY7.js";import"./animation-CpmNWIfH.js";import"./SearchField-Ydy9J2Qd.js";import"./FieldError-ihzqASzL.js";import"./Form-DCKRbBhQ.js";import"./useFormValidation-DmvJMR95.js";import"./useTextField-CB7RKCz2.js";import"./useField-BOxSzQUy.js";import"./useFormReset-CwpxsAfX.js";import"./Virtualizer-D_5GC5DF.js";import"./useFilter-DzpaBCLk.js";import"./getNodeText-xmo2Bn7f.js";import"./BUIRoutingProvider-DeUR7dS3.js";import"./Link-RdfuAKuv.js";import"./Tooltip-giAPcCGO.js";import"./VisuallyHidden-B6Miivwm.js";import"./Tabs-_eKzBo1z.js";import"./useHasTabbableChild-b-jx-_89.js";const w={"bui-FullPage":"_bui-FullPage_caxn1_20"},T=x()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=b.forwardRef((i,n)=>{const{ownProps:h,restProps:d}=f(T,i),{classes:g}=h;return e.jsx("main",{ref:n,className:g.root,...d})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

The FullPage component consumes the \`--bui-header-height\` CSS custom property
set by the Header component to calculate its height as
\`calc(100dvh - var(--bui-header-height, 0px))\`. Content inside the FullPage
scrolls independently while the Header stays visible.

@public`,methods:[],displayName:"FullPage",props:{className:{required:!1,tsType:{name:"string"},description:""}},composes:["Omit"]};const m=P.meta({title:"Backstage UI/FullPage",component:r,parameters:{layout:"fullscreen"}}),c=i=>e.jsx(y,{children:e.jsx(j,{children:e.jsx(i,{})})}),F=[{id:"overview",label:"Overview",href:"/overview"},{id:"checks",label:"Checks",href:"/checks"},{id:"tracks",label:"Tracks",href:"/tracks"},{id:"campaigns",label:"Campaigns",href:"/campaigns"}],u=Array.from({length:20},(i,n)=>e.jsx(t,{as:"p",children:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},n)),o=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{style:{backgroundColor:"#c3f0ff"},children:e.jsx(p,{children:e.jsx(t,{as:"p",children:"This content fills the remaining viewport height below the Header."})})})]})}),a=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin"}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"h2",variant:"title-medium",children:"Scrollable Content"}),e.jsx(t,{as:"p",children:"The content below scrolls independently while the Header stays pinned at the top."}),u]})})]})}),s=m.story({decorators:[c],render:()=>e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"My Plugin",tabs:F}),e.jsx(r,{children:e.jsxs(p,{children:[e.jsx(t,{as:"p",children:"The FullPage height adjusts automatically when the Header includes tabs, thanks to the ResizeObserver measuring the Header's actual height."}),u]})})]})});o.input.parameters={...o.input.parameters,docs:{...o.input.parameters?.docs,source:{originalSource:`meta.story({
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
})`,...s.input.parameters?.docs?.source}}};const qe=["Default","WithScrollableContent","WithTabs"];export{o as Default,a as WithScrollableContent,s as WithTabs,qe as __namedExportsOrder};
