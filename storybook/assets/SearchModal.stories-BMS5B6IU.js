import{bR as t,u as d,l as u,a5 as h}from"./iframe-DQDMWdhR.js";import{r as g}from"./plugin-DinNPOpx.js";import{S as m,u as n,b as x}from"./useSearchModal-BoPaktfh.js";import{B as c}from"./Button-7lQi3A0V.js";import{c as S,b as f,a as M}from"./DialogTitle-B8QICb-T.js";import{B as j}from"./Box-BSlsrAFI.js";import{S as r}from"./Grid-BqTQ24QW.js";import{S as C}from"./SearchType-Chob6F-h.js";import{L as y}from"./List-BphJ6ppe.js";import{H as R}from"./DefaultResultListItem-DAr4MPMq.js";import{O as I}from"./appWrappers-DJaP6K0M.js";import{m as B}from"./makeStyles-B5aW9Q-2.js";import{s as D,M as b}from"./api-Cszqq3xI.js";import{S as k}from"./SearchContext-BblXcW-p.js";import{SearchBar as v}from"./SearchBar-hGlCz6ql.js";import{S as T}from"./SearchResult-T19ZNqYr.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CCR_srtZ.js";import"./Plugin-Dr3yvPWD.js";import"./componentData-BA-PJomV.js";import"./useAnalytics-IT8D4hNJ.js";import"./useApp-CTum3p-d.js";import"./useRouteRef-Hr5uaXnC.js";import"./ArrowForward-BUt1Qfk4.js";import"./translation-dBAzLFeT.js";import"./Page-CQu11Q2J.js";import"./useMediaQuery--8l9UWnV.js";import"./Divider-DomKsQ_s.js";import"./ArrowBackIos-862qIUOx.js";import"./ArrowForwardIos-uAZALjAd.js";import"./translation-JeUMe1eu.js";import"./Modal-CbfwUxRS.js";import"./Portal-Dba-4_gW.js";import"./Backdrop-BQlzJPpR.js";import"./styled-DGFjQDj-.js";import"./ExpandMore-DOwjJ_du.js";import"./useAsync-OEymOO9h.js";import"./useMountedState-DN-AA97d.js";import"./AccordionDetails--_XJ7ukc.js";import"./index-B9sM2jn7.js";import"./Collapse-BfmpBEPX.js";import"./ListItem-DO9NzT1C.js";import"./ListContext-K2B4oL84.js";import"./ListItemIcon-A8qqT3Jb.js";import"./ListItemText-2PUuT8MN.js";import"./Tabs-DOx-p4nx.js";import"./KeyboardArrowRight-Cc9RSmsI.js";import"./FormLabel-BClCGImR.js";import"./formControlState-Ch9Fx83B.js";import"./InputLabel-km9T_Ck2.js";import"./Select-D9e-RzFQ.js";import"./Popover-BFgyghhY.js";import"./MenuItem-1Xj4aVlh.js";import"./Checkbox-CTjjnOqZ.js";import"./SwitchBase-DH0GPDaS.js";import"./Chip-Ds4K6qc9.js";import"./Link-Cl_RxpbQ.js";import"./index-DY_5w8ej.js";import"./lodash-3i45iK7k.js";import"./WebStorage-B6j33j4j.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-BOl6H3dX.js";import"./useIsomorphicLayoutEffect-BNg27PGc.js";import"./BUIProvider-TV3l8URi.js";import"./openLink-D1CPkxqm.js";import"./useResolvedHref-DVcfK57c.js";import"./Search-B3ruVHFN.js";import"./useDebounce-DMIaz-3o.js";import"./InputAdornment-c-62pJRf.js";import"./TextField-BYM7y082.js";import"./useElementFilter-BolAHkQg.js";import"./EmptyState-DTdYhslx.js";import"./Progress-CJX2U4e9.js";import"./LinearProgress-BooyNtQl.js";import"./ResponseErrorPanel-BnR8OnZd.js";import"./ErrorPanel-COcAsJP5.js";import"./WarningPanel-BgagYreT.js";import"./MarkdownContent-CwNfWeSX.js";import"./CodeSnippet-DtU3_YHx.js";import"./CopyTextButton-DECt3aqZ.js";import"./useCopyToClipboard-Dbaufu2W.js";import"./Tooltip-CHviRUrF.js";import"./Popper-DRhkdNdl.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
