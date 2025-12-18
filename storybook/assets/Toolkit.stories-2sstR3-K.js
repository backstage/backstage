import{j as o}from"./iframe-BY8lR-L8.js";import{c as e}from"./plugin-BzoiYKlF.js";import{S as l}from"./Grid-BjrJvsR3.js";import{C as m}from"./ComponentAccordion-DYiZFZ26.js";import{w as a}from"./appWrappers-CwbFz284.js";import{T as i}from"./TemplateBackstageLogoIcon-jTS8wOS8.js";import{I as s}from"./InfoCard-9a18SuEb.js";import"./preload-helper-PPVm8Dsz.js";import"./Plugin-pD8p1KrB.js";import"./componentData-UKDdzeuB.js";import"./useAnalytics-BVxeCBFY.js";import"./useApp-BvPEffuf.js";import"./useRouteRef-X5r9b_hf.js";import"./index-BS6rRTnv.js";import"./DialogTitle-DJH-tFiF.js";import"./Modal-ob7ZinQq.js";import"./Portal-9M61fEx6.js";import"./Backdrop-NlvjxJvh.js";import"./Button-DOtnJgPP.js";import"./useObservable-DjQNHeFS.js";import"./useIsomorphicLayoutEffect-4IAuBrOv.js";import"./ExpandMore-fkHecgaQ.js";import"./AccordionDetails-Fks5AbbD.js";import"./index-B9sM2jn7.js";import"./Collapse-B6v7_Lug.js";import"./useAsync-DNLOGNju.js";import"./useMountedState-DwTRr6Bf.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-B8GBl9qU.js";import"./ErrorBoundary-BxthC0Iq.js";import"./ErrorPanel-DUhzHP9c.js";import"./WarningPanel-wg4n1CXF.js";import"./MarkdownContent-CEOHELvX.js";import"./CodeSnippet-ajdkoRYg.js";import"./Box-COui6GIh.js";import"./styled-Ckl9NdN2.js";import"./CopyTextButton-HjsOaOKI.js";import"./useCopyToClipboard-Bl5GfTuC.js";import"./Tooltip-CQzh8PM4.js";import"./Popper-CAf4oxXD.js";import"./List-Zd71n2FM.js";import"./ListContext-CBZm9pJe.js";import"./ListItem-CGZ3ypeU.js";import"./ListItemText-BFb2Grym.js";import"./LinkButton-0O3nZFeQ.js";import"./Link-CG56jGaN.js";import"./lodash-Y_-RFQgK.js";import"./CardHeader-Hrxg6OrZ.js";import"./Divider-C9c6KGoD.js";import"./CardActions-D47ZvRGZ.js";import"./BottomLink-C0C-DKvG.js";import"./ArrowForward-BmZGDfYA.js";const co={title:"Plugins/Home/Components/Toolkit",decorators:[n=>a(o.jsx(n,{}))]},r=()=>o.jsx(l,{item:!0,xs:12,md:6,children:o.jsx(e,{tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})})})}),t=()=>{const n=p=>o.jsx(m,{expanded:!0,...p});return o.jsx(s,{title:"Toolkit",noPadding:!0,children:o.jsxs(l,{item:!0,children:[o.jsx(e,{title:"Tools 1",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:n}),o.jsx(e,{title:"Tools 2",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m}),o.jsx(e,{title:"Tools 3",tools:Array(8).fill({url:"#",label:"link",icon:o.jsx(i,{})}),Renderer:m})]})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};t.__docgenInfo={description:"",methods:[],displayName:"InAccordion"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
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
