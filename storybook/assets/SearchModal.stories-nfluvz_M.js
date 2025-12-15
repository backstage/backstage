import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DpqnIERb.js";import{r as x}from"./plugin-XTH6pJl9.js";import{S as m,u as n,a as S}from"./useSearchModal-DkvMpxhE.js";import{B as c}from"./Button-CVkCSpbG.js";import{a as f,b as M,c as j}from"./DialogTitle--5D8qIle.js";import{B as C}from"./Box-B2dMzSz4.js";import{S as r}from"./Grid-ByES49Fm.js";import{S as y}from"./SearchType-CvRhj9iS.js";import{L as I}from"./List-CZbmWexd.js";import{H as R}from"./DefaultResultListItem-CYBFvHnd.js";import{s as B,M as D}from"./api-lgE5jH2i.js";import{S as T}from"./SearchContext-CPmiQTPj.js";import{w as k}from"./appWrappers-DtX5QIpn.js";import{SearchBar as v}from"./SearchBar-DN5bM2B5.js";import{a as b}from"./SearchResult-C5AWBCaz.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CzHsSl9-.js";import"./Plugin-BwzRXZkr.js";import"./componentData-Bjp7AxYA.js";import"./useAnalytics-DvwM4ONZ.js";import"./useApp-BzWSwMGn.js";import"./useRouteRef-Do6k1rAi.js";import"./index-DoyRYStT.js";import"./ArrowForward-BUxo812p.js";import"./translation-DxKwz3QM.js";import"./Page-C_sJTRbJ.js";import"./useMediaQuery-DOy6FFFK.js";import"./Divider-BjLL1Xub.js";import"./ArrowBackIos-BBQfJuv4.js";import"./ArrowForwardIos-BjFVdURK.js";import"./translation-BJBR4TYC.js";import"./Modal-DsN87qYK.js";import"./Portal-BmmQaE8x.js";import"./Backdrop-BRjIVZ8-.js";import"./styled-iMmr_MI_.js";import"./ExpandMore-BgvB3-yb.js";import"./useAsync-DJIduLQY.js";import"./useMountedState-5johZ_Rp.js";import"./AccordionDetails-Bu4VHsDj.js";import"./index-B9sM2jn7.js";import"./Collapse-BXZ4KKDG.js";import"./ListItem-D0Z8ElGo.js";import"./ListContext-BxawfRoI.js";import"./ListItemIcon-DJynWx8H.js";import"./ListItemText-DoVLQ6VK.js";import"./Tabs-DUFc6DFf.js";import"./KeyboardArrowRight-BDFjPrvw.js";import"./FormLabel-BjiyEKGu.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BXtaIVU6.js";import"./InputLabel-Y-P5_fiQ.js";import"./Select-DlqTSxMB.js";import"./Popover-cJal3ZUL.js";import"./MenuItem-DwVoi_KI.js";import"./Checkbox-BfKpJ7_h.js";import"./SwitchBase-CuJLsZ1e.js";import"./Chip-BUDV__U1.js";import"./Link-CYlpUQKG.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-BoxxXUWC.js";import"./useIsomorphicLayoutEffect-7TzPryCL.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-qH6IgdKu.js";import"./useDebounce-DZM3Tp1V.js";import"./InputAdornment-Ckj8ksgW.js";import"./TextField-BurlAoT0.js";import"./useElementFilter-C3Uuu8LE.js";import"./EmptyState-QyceDM6T.js";import"./Progress-BAPOf5dV.js";import"./LinearProgress-O1OsW5QD.js";import"./ResponseErrorPanel-4tNBZqk5.js";import"./ErrorPanel-9MxiIPAH.js";import"./WarningPanel-4qyRcOUk.js";import"./MarkdownContent-C_B0rjEe.js";import"./CodeSnippet-BZN7CHRt.js";import"./CopyTextButton-BZ1rpe7z.js";import"./useCopyToClipboard-DxpZSgA2.js";import"./Tooltip-BVf39uWy.js";import"./Popper-DbBOQ0oU.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
