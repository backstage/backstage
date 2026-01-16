import{j as o}from"./iframe-Ck0aXmTM.js";import{c as e}from"./plugin-DWMh387_.js";import{S as l}from"./Grid-DJzZ2-y-.js";import{C as m}from"./ComponentAccordion-isR8WFR_.js";import{w as a}from"./appWrappers-sOes-H4-.js";import{T as i}from"./TemplateBackstageLogoIcon-C0XMAXxe.js";import{I as s}from"./InfoCard-XzrYcPvm.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-D0ldxJ2a.js";import"./componentData-CCV_iCSl.js";import"./useAnalytics-B-_BiaZI.js";import"./useApp-Bsc5dzDy.js";import"./useRouteRef-CUlQEYbr.js";import"./index-DzaKdVpu.js";import"./DialogTitle-CrkBwyZG.js";import"./Modal-CynqYC-h.js";import"./Portal-enzQuAv4.js";import"./Backdrop-D-sGQwlB.js";import"./Button-1pGVjime.js";import"./useObservable-DUKTvAPs.js";import"./useIsomorphicLayoutEffect-CpSeSuYs.js";import"./ExpandMore-XskE5SkY.js";import"./AccordionDetails-Dunbukgx.js";import"./index-B9sM2jn7.js";import"./Collapse-DxAw5EoH.js";import"./useAsync-p0jLc8GG.js";import"./useMountedState-BgEDmEmL.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-CrT56zzi.js";import"./ErrorBoundary-BLpzyTxf.js";import"./ErrorPanel-SFTFZur6.js";import"./WarningPanel-BnKvh7bd.js";import"./MarkdownContent-DTz2Je40.js";import"./CodeSnippet-1zCVoflW.js";import"./Box-DpOIFL5c.js";import"./styled-DLjnXpzN.js";import"./CopyTextButton-C18-3nwc.js";import"./useCopyToClipboard-g3w1_GHx.js";import"./Tooltip-Sxlj4qdH.js";import"./Popper-DOPOD1lh.js";import"./List-Ch4xqBdJ.js";import"./ListContext-m5pyxhJx.js";import"./ListItem-BI_yLDsO.js";import"./ListItemText-BN5MiG2A.js";import"./LinkButton-D0uXKDvs.js";import"./Link-8mv2gKfv.js";import"./lodash-DLuUt6m8.js";import"./CardHeader-BGZWsIne.js";import"./Divider-B0knNu2M.js";import"./CardActions-B9r0eKLY.js";import"./BottomLink-Cj7rNAle.js";import"./ArrowForward-DkJkdPgV.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))],tags:["!manifest"]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <Grid item xs={12} md={6}>
      <HomePageToolkit tools={Array(8).fill({
      url: '#',
      label: 'link',
      icon: <TemplateBackstageLogoIcon />
    })} />
    </Grid>;
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  const ExpandedComponentAccordion = (props: any) => <ComponentAccordion expanded {...props} />;
  return <InfoCard title="Toolkit" noPadding>
      <Grid item>
        <HomePageToolkit title="Tools 1" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ExpandedComponentAccordion} />
        <HomePageToolkit title="Tools 2" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
        <HomePageToolkit title="Tools 3" tools={Array(8).fill({
        url: '#',
        label: 'link',
        icon: <TemplateBackstageLogoIcon />
      })} Renderer={ComponentAccordion} />
      </Grid>
    </InfoCard>;
}`,...t.parameters?.docs?.source}}};const uo=["Default","InAccordion"];export{r as Default,t as InAccordion,uo as __namedExportsOrder,co as default};
