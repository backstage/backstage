import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-B8uJzJnC.js";import{P as l}from"./PluginHeader-C3BFs-86.js";import{C as p}from"./Container-C9RxO3wc.js";import{T as t}from"./Text-r9meaL2F.js";import{B as j}from"./BUIProvider-B485Y6HT.js";import"./preload-helper-PPVm8Dsz.js";import"./index-C3TndV9r.js";import"./utils-C9WtHl0n.js";import"./useObjectRef-B58w8bQG.js";import"./useCollection-CvOYNyzq.js";import"./useFocusRing-uHGre-No.js";import"./openLink-BUwh7SN8.js";import"./Hidden--CtbbQAG.js";import"./keyboard-DuJAq24v.js";import"./FocusScope-8F6SB8jw.js";import"./useEvent-Bv3yEJFZ.js";import"./I18nProvider-BAFWouLl.js";import"./usePress-z5JJKJO5.js";import"./textSelection-COVkqnKL.js";import"./useControlledState-Bsv8jzCO.js";import"./Link-C8eOrPw6.js";import"./useLink-Dddohadt.js";import"./useHover-CGBJrmnR.js";import"./useLocalizedStringFormatter-Cmwn2jYC.js";import"./Button-9hcql9Z1.js";import"./Label-B8rV63W8.js";import"./useLabel-DuQ-sB8F.js";import"./useLabels-vvtSY4r8.js";import"./number-Cc-kUzHo.js";import"./useButton-B84fiS4B.js";import"./Menu-CGbsF87i.js";import"./Autocomplete-nI_kARcr.js";import"./getItemCount-uMh6GABa.js";import"./Input-fVCzcyQW.js";import"./ListBox-Bmbrmpsk.js";import"./Text-C2P1-Stb.js";import"./useListState-DwWpE2UK.js";import"./Dialog-CDtLVRGJ.js";import"./Heading-BXqzHZ6g.js";import"./useOverlayTriggerState-DCu5HTgY.js";import"./VisuallyHidden-BSSg_A1m.js";import"./animation-DAXhfvHs.js";import"./SearchField-D1T0c6Hb.js";import"./FieldError-TYXfNCFj.js";import"./useFormValidation-t3MKasab.js";import"./useTextField-C0zGORas.js";import"./useField-CUj6IoGp.js";import"./useFormReset-X4EXoTS3.js";import"./Virtualizer-BaLbtrxQ.js";import"./useFilter-XXN06l-U.js";import"./getNodeText-5Q0dGTIm.js";import"./Link-DWp-BzeI.js";import"./useResolvedHref-CVch4iPG.js";import"./Tooltip-Gmp_C_i_.js";import"./VisuallyHidden-Dqwa-E0d.js";import"./Tabs-BG_rIeTd.js";import"./useHasTabbableChild-CVLfejS7.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
