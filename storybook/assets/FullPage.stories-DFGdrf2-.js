import{bg as b,ca as x,cH as P,bR as e,c7 as f,w as y}from"./iframe-ttKo4f2F.js";import{P as l}from"./PluginHeader-wGgdjbEB.js";import{C as p}from"./Container-NV-axY_w.js";import{T as t}from"./Text-Bfr4QZQe.js";import{B as j}from"./BUIProvider-CbQ91Q4l.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B4b2aH3v.js";import"./utils-C1HatmDL.js";import"./useObjectRef-CK28UWWB.js";import"./useCollection-DW_ZjLWl.js";import"./useFocusRing-DO5dfoZO.js";import"./openLink-DrXx31rJ.js";import"./Hidden-B19yG0l1.js";import"./keyboard-B0jD7YCN.js";import"./FocusScope-B8bFM2EB.js";import"./useEvent-CAl7p6Y1.js";import"./I18nProvider-CE77ZQhE.js";import"./usePress-C-9nwvnr.js";import"./textSelection-Dxn0Zxb-.js";import"./useControlledState-Dm95DOze.js";import"./Link-B_Uryhbj.js";import"./useLink-01nRl2rJ.js";import"./useHover-zTEfdeKB.js";import"./useLocalizedStringFormatter-CMRKakYM.js";import"./Button-ByqwGc9h.js";import"./Label-CNpe8i9L.js";import"./useLabel-BtTJK2a0.js";import"./useLabels-BkKSc_yM.js";import"./number-BolYm4pY.js";import"./useButton-Ca5r3393.js";import"./Menu-DZ4dFyht.js";import"./Autocomplete-DcP3dRW8.js";import"./getItemCount-8yQ549qQ.js";import"./Input-CYIbAQXq.js";import"./ListBox-fBUduI9p.js";import"./Text-BStet0rF.js";import"./useListState-DXECVTCZ.js";import"./Dialog-Cj-H9Py4.js";import"./Heading-B4d8iVzV.js";import"./useOverlayTriggerState-RAXhowei.js";import"./VisuallyHidden-BBbZvg1N.js";import"./animation-B6X1Mob_.js";import"./SearchField-BU40jX1B.js";import"./FieldError-CONGBJVz.js";import"./useFormValidation-DFe7ydc1.js";import"./useTextField-BW7r-z_5.js";import"./useField-BC6B7UUn.js";import"./useFormReset-Dd40QI8Q.js";import"./Virtualizer-BcJVdsDr.js";import"./useFilter-CPBh052h.js";import"./getNodeText-wBijyGWQ.js";import"./Link-D-_T5xi0.js";import"./useResolvedHref-NCR-oxyO.js";import"./Tooltip-BReNumtE.js";import"./VisuallyHidden-BKiviVyE.js";import"./Tabs-DWZOON4A.js";import"./useHasTabbableChild-BQuyoEIm.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
