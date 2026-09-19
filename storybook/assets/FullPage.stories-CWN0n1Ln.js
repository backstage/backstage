import{be as b,c8 as x,cE as P,bQ as e,c5 as f,w as y}from"./iframe-CPZQIdXt.js";import{P as l}from"./PluginHeader-DIfQk-AJ.js";import{C as p}from"./Container-D0Z21sOP.js";import{T as t}from"./Text-YBNUwyLP.js";import{B as j}from"./BUIProvider-DjUSh1Zp.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DvySIO-N.js";import"./utils-DfS0MLG1.js";import"./useObjectRef-Bd12eOMu.js";import"./useCollection-DfAm7AFo.js";import"./useFocusRing--8mLVlO1.js";import"./openLink-C87naxyd.js";import"./Hidden-DOapgqgb.js";import"./keyboard-qwYU4mPS.js";import"./FocusScope-1iLQ0ib0.js";import"./useEvent-D7WD1hZR.js";import"./I18nProvider--qafPNbZ.js";import"./usePress-Oa17hApX.js";import"./textSelection-Comt_RX9.js";import"./useControlledState-C1C-unW2.js";import"./Link-CgYQxDR5.js";import"./useLink-Dqbf1BYh.js";import"./useHover-CNFNn4CS.js";import"./useLocalizedStringFormatter-BLPR5mwD.js";import"./Button-DbyB3ML5.js";import"./Label-CBzuLVn0.js";import"./useLabel-NKDByoxa.js";import"./useLabels-j_pZQhad.js";import"./number-VnPE9G7J.js";import"./useButton-NJXPyhR_.js";import"./Menu-Cbua2DIk.js";import"./Autocomplete-BFWBSmC8.js";import"./getItemCount-SrAkk7Ev.js";import"./Input-CulmNUpA.js";import"./ListBox-D4atw1Zc.js";import"./Text-p0WAAzoH.js";import"./useListState-CNdvtHz-.js";import"./Dialog-C46yy6Vw.js";import"./Heading-DOTNhqTx.js";import"./useOverlayTriggerState-CAB3T-Hz.js";import"./VisuallyHidden-DfN5lpxa.js";import"./animation-ClFfzpbX.js";import"./SearchField-BgXj75f9.js";import"./FieldError-Dygq4nAa.js";import"./useFormValidation-esOLhpCP.js";import"./useTextField-B0m-e8cO.js";import"./useField-DbqECwXJ.js";import"./useFormReset-sDuCpydg.js";import"./Virtualizer-oE8XHv51.js";import"./useFilter-Dcd5_XLa.js";import"./getNodeText-DSOm7-m3.js";import"./Link-xC5x9ibk.js";import"./useResolvedHref-BYmWRvjU.js";import"./Tooltip-DBkhfNVt.js";import"./VisuallyHidden-CEi3cAFp.js";import"./Tabs-CzRKUZya.js";import"./useHasTabbableChild-N3doR_iC.js";import"./BUIRoutingProvider-6j4HiUai.js";const w={"bui-FullPage":"_bui-FullPage_1vdnu_20"},T=b()({styles:w,classNames:{root:"bui-FullPage"},propDefs:{className:{}}}),r=x.forwardRef((i,n)=>{const{ownProps:d,restProps:h}=P(T,i),{classes:g}=d;return e.jsx("main",{ref:n,className:g.root,...h})});r.__docgenInfo={description:`A component that fills the remaining viewport height below the Header.

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
