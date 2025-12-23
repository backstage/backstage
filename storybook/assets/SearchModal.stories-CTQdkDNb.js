import{j as t,m as d,I as u,b as h,T as g}from"./iframe-Hw755TNi.js";import{r as x}from"./plugin-9mq8IABY.js";import{S as m,u as n,a as S}from"./useSearchModal-BI4RQtFw.js";import{B as c}from"./Button-CpMmzG9U.js";import{a as f,b as M,c as j}from"./DialogTitle-DJbOyMxK.js";import{B as C}from"./Box-DcpjYi3J.js";import{S as r}from"./Grid-w98sXAXk.js";import{S as y}from"./SearchType-8cAtw05x.js";import{L as I}from"./List-Z-bLSsG8.js";import{H as R}from"./DefaultResultListItem-CMk7cmAN.js";import{s as B,M as D}from"./api-BlXSYa10.js";import{S as T}from"./SearchContext-D4LIAA57.js";import{w as k}from"./appWrappers-D03uvxZe.js";import{SearchBar as v}from"./SearchBar-BmVoNAC_.js";import{a as b}from"./SearchResult-fXJDmbft.js";import"./preload-helper-PPVm8Dsz.js";import"./index-8CFES-Rb.js";import"./Plugin-BMqfvgOd.js";import"./componentData-BOwbR1Jz.js";import"./useAnalytics-CLuGYyUh.js";import"./useApp-DdUuBagy.js";import"./useRouteRef-BmYWNidK.js";import"./index-CMiNgydu.js";import"./ArrowForward-BgApEUXb.js";import"./translation-D5hELoyz.js";import"./Page-nh5BnDMg.js";import"./useMediaQuery-C2u3FrRz.js";import"./Divider-BkC6drLy.js";import"./ArrowBackIos-C9nkRUym.js";import"./ArrowForwardIos-DOrmnunF.js";import"./translation-CVQs97lh.js";import"./Modal-DYeoU8Cn.js";import"./Portal-BZ6RZj06.js";import"./Backdrop-0thaD7uc.js";import"./styled-qTtGNmm_.js";import"./ExpandMore-CG9kYvvb.js";import"./useAsync-DhB8gEfG.js";import"./useMountedState-DdJ7HSpX.js";import"./AccordionDetails-6Uenh_Cj.js";import"./index-B9sM2jn7.js";import"./Collapse-Cpllhes9.js";import"./ListItem-DwV3XkH8.js";import"./ListContext-moCHcqFh.js";import"./ListItemIcon-tBZ4Y2eF.js";import"./ListItemText-f-UryDTW.js";import"./Tabs-CmElQQl8.js";import"./KeyboardArrowRight-BYNU4bTa.js";import"./FormLabel-CCu-keZU.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CreWTCig.js";import"./InputLabel-GF3KXnMY.js";import"./Select-DNnS_kNb.js";import"./Popover-BfMi8ZLM.js";import"./MenuItem-DoJncjoe.js";import"./Checkbox-DlGWn6a6.js";import"./SwitchBase-4DCRLRcH.js";import"./Chip-Cfk_D5N7.js";import"./Link-BYu3CTsd.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-Bntv1Tee.js";import"./useIsomorphicLayoutEffect-VemboVK5.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BqRmpvax.js";import"./useDebounce-BStQ2PmK.js";import"./InputAdornment--CoVrWlh.js";import"./TextField-D0Q5AYGT.js";import"./useElementFilter-B1zXfYdI.js";import"./EmptyState-CsQgzFqF.js";import"./Progress-3DFxdfJJ.js";import"./LinearProgress-CUr5wi2o.js";import"./ResponseErrorPanel-C_fAQ7ko.js";import"./ErrorPanel-CQgjrtaw.js";import"./WarningPanel-BGdCoFxI.js";import"./MarkdownContent-C43gFO83.js";import"./CodeSnippet-8GoXIwx4.js";import"./CopyTextButton-8-jfuG_8.js";import"./useCopyToClipboard-DQJZpUYG.js";import"./Tooltip-BwBST4sz.js";import"./Popper-QpCwrVnW.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
