import{j as t,T as p,c,C as l,m as i,a as d}from"./iframe-BOS9XsSt.js";import{s as g,H as u}from"./plugin-DSJnjIU4.js";import{c as h}from"./api--dsHPIxc.js";import{c as f}from"./catalogApiMock-D3mbj07r.js";import{s as x}from"./api-D2Yypy4C.js";import{S as y}from"./SearchContext-CKylexrk.js";import{P as S}from"./Page-BGqD3Nor.js";import{S as r}from"./Grid-DpJzwvsy.js";import{b as k,a as j,c as C}from"./plugin-wCQqv6mY.js";import{T as P}from"./TemplateBackstageLogo-CKKBbJwa.js";import{T}from"./TemplateBackstageLogoIcon-ClOMnXMB.js";import{e as I}from"./routes-BiSGuQZv.js";import{w as v}from"./appWrappers-Bmoaw7n3.js";import{s as G}from"./StarredEntitiesApi-CROn8SY-.js";import{M as A}from"./MockStarredEntitiesApi-B4yqb_16.js";import{I as B}from"./InfoCard-fL2e7Fb-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CcT_T83P.js";import"./Plugin-BLgAY6cH.js";import"./componentData-5CzPqeYQ.js";import"./useAnalytics-Cu9Lzm5q.js";import"./useApp-D9_f5DFp.js";import"./useRouteRef-D6pX7G_I.js";import"./index-BYPtPQ_E.js";import"./ref-C0VTUPuL.js";import"./lodash-Czox7iJy.js";import"./useAsync-DzexZZOZ.js";import"./useMountedState-DaLgI8Ua.js";import"./DialogTitle-DX7hGYAC.js";import"./Modal-B4EjrvcH.js";import"./Portal-CERNgFq6.js";import"./Backdrop-CpYmoctA.js";import"./Button-D34xgd1Q.js";import"./useObservable-DDhxjihL.js";import"./useIsomorphicLayoutEffect-CrKWISEl.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./CardContent-BiZP4o13.js";import"./ErrorBoundary-Biou5a7y.js";import"./ErrorPanel-DvbxkBY0.js";import"./WarningPanel-DBRwILC2.js";import"./ExpandMore-DPjiSkKA.js";import"./AccordionDetails-CY60n5OB.js";import"./index-B9sM2jn7.js";import"./Collapse-CD_ND2rt.js";import"./MarkdownContent-BPIFlL-y.js";import"./CodeSnippet-CVmjwtmC.js";import"./Box-BWfLAxjo.js";import"./styled-dnrl8B5-.js";import"./CopyTextButton-Bp4E28TJ.js";import"./useCopyToClipboard-hUj9jZ5o.js";import"./Tooltip-CAWH6kC3.js";import"./Popper-B9Sqk4H1.js";import"./List-BHDOi6uW.js";import"./ListContext-a1j27SdY.js";import"./ListItem-D4jOCDNX.js";import"./ListItemText-BRz_C0D5.js";import"./LinkButton-Cfhz45Fp.js";import"./Link-B09CKdbR.js";import"./CardHeader-CW0rLmly.js";import"./Divider-CxQHAU7C.js";import"./CardActions-DzUljMxl.js";import"./BottomLink-uXx83WET.js";import"./ArrowForward-DrsDRv_i.js";const b=[{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity",title:"Mock Starred Entity!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-2",title:"Mock Starred Entity 2!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-3",title:"Mock Starred Entity 3!"}},{apiVersion:"1",kind:"Component",metadata:{name:"mock-starred-entity-4",title:"Mock Starred Entity 4!"}}],E=f({entities:b}),a=new A;a.toggleStarred("component:default/example-starred-entity");a.toggleStarred("component:default/example-starred-entity-2");a.toggleStarred("component:default/example-starred-entity-3");a.toggleStarred("component:default/example-starred-entity-4");const Wt={title:"Plugins/Home/Templates",tags:["!manifest"],decorators:[e=>v(t.jsx(t.Fragment,{children:t.jsx(p,{apis:[[h,E],[G,a],[x,{query:()=>Promise.resolve({results:[]})}],[c,new l({stackoverflow:{baseUrl:"https://api.stackexchange.com/2.2"}})]],children:t.jsx(e,{})})}),{mountedRoutes:{"/hello-company":g.routes.root,"/catalog/:namespace/:kind/:name":I}})]},H=i(e=>({searchBarInput:{maxWidth:"60vw",margin:"auto",backgroundColor:e.palette.background.paper,borderRadius:"50px",boxShadow:e.shadows[1]},searchBarOutline:{borderStyle:"none"}})),R=i(e=>({container:{margin:e.spacing(5,0)},svg:{width:"auto",height:100},path:{fill:"#7df3e1"}})),o=()=>{const e=H(),{svg:s,path:n,container:m}=R();return t.jsx(y,{children:t.jsx(S,{themeId:"home",children:t.jsx(d,{children:t.jsxs(r,{container:!0,justifyContent:"center",spacing:6,children:[t.jsx(k,{className:m,logo:t.jsx(P,{classes:{svg:s,path:n}})}),t.jsx(r,{container:!0,item:!0,xs:12,justifyContent:"center",children:t.jsx(u,{InputProps:{classes:{root:e.searchBarInput,notchedOutline:e.searchBarOutline}},placeholder:"Search"})}),t.jsxs(r,{container:!0,item:!0,xs:12,children:[t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(j,{})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(C,{tools:Array(8).fill({url:"#",label:"link",icon:t.jsx(T,{})})})}),t.jsx(r,{item:!0,xs:12,md:6,children:t.jsx(B,{title:"Composable Section",children:t.jsx("div",{style:{height:370}})})})]})]})})})})};o.__docgenInfo={description:"",methods:[],displayName:"DefaultTemplate"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    svg,
    path,
    container
  } = useLogoStyles();
  return <SearchContextProvider>
      <Page themeId="home">
        <Content>
          <Grid container justifyContent="center" spacing={6}>
            <HomePageCompanyLogo className={container} logo={<TemplateBackstageLogo classes={{
            svg,
            path
          }} />} />
            <Grid container item xs={12} justifyContent="center">
              <HomePageSearchBar InputProps={{
              classes: {
                root: classes.searchBarInput,
                notchedOutline: classes.searchBarOutline
              }
            }} placeholder="Search" />
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12} md={6}>
                <HomePageStarredEntities />
              </Grid>
              <Grid item xs={12} md={6}>
                <HomePageToolkit tools={Array(8).fill({
                url: '#',
                label: 'link',
                icon: <TemplateBackstageLogoIcon />
              })} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoCard title="Composable Section">
                  {/* placeholder for content */}
                  <div style={{
                  height: 370
                }} />
                </InfoCard>
              </Grid>
            </Grid>
          </Grid>
        </Content>
      </Page>
    </SearchContextProvider>;
}`,...o.parameters?.docs?.source}}};const zt=["DefaultTemplate"];export{o as DefaultTemplate,zt as __namedExportsOrder,Wt as default};
