import{j as t,m as d,I as u,b as h,T as g}from"./iframe-BpNetfkk.js";import{r as x}from"./plugin-DKV9oNjl.js";import{S as m,u as n,a as S}from"./useSearchModal-DFStcu9I.js";import{B as c}from"./Button-D2OH5WH0.js";import{a as f,b as M,c as j}from"./DialogTitle-E_A2_fbu.js";import{B as C}from"./Box-JPQ-K-XF.js";import{S as r}from"./Grid-DGDU_W7d.js";import{S as y}from"./SearchType-CSvsQaxo.js";import{L as I}from"./List-CcdBBh0x.js";import{H as R}from"./DefaultResultListItem-BxQs0Zgx.js";import{s as B,M as D}from"./api-BdOdcRRd.js";import{S as T}from"./SearchContext-CGmv-zVd.js";import{w as k}from"./appWrappers-BOa7ROWw.js";import{SearchBar as v}from"./SearchBar-Ci4pZqcm.js";import{a as b}from"./SearchResult-WbIWhLyB.js";import"./preload-helper-D9Z9MdNV.js";import"./index-CnTzRFsp.js";import"./Plugin-C7nO-Ahz.js";import"./componentData-DzI36JOr.js";import"./useAnalytics-BKPjjI-y.js";import"./useApp-BAlbHaS5.js";import"./useRouteRef-xryfITRq.js";import"./index-DgvPNMU4.js";import"./ArrowForward-DwUrP4PQ.js";import"./translation-BGwPaT45.js";import"./Page-CM8OOJT2.js";import"./useMediaQuery-CGFzaSvS.js";import"./Divider-2QoBmfwj.js";import"./ArrowBackIos-CavtmnF_.js";import"./ArrowForwardIos-C8ExvMZC.js";import"./translation-DQWBFQd-.js";import"./Modal-CJXuzFvx.js";import"./Portal-D3MaVJdo.js";import"./Backdrop-DCl54FLG.js";import"./styled-BVnjfZaP.js";import"./ExpandMore-Dg48zgbf.js";import"./useAsync-BEoRug7E.js";import"./useMountedState-ya7tp212.js";import"./AccordionDetails-CXV1bjLg.js";import"./index-DnL3XN75.js";import"./Collapse-CFskqauo.js";import"./ListItem-BE6uqYrF.js";import"./ListContext-BkpiPoXc.js";import"./ListItemIcon-CdIWE3bw.js";import"./ListItemText-7Fv6oNRR.js";import"./Tabs-B7x0Xgvn.js";import"./KeyboardArrowRight-BERUwLW_.js";import"./FormLabel-HI5ElYjJ.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-p1mzlkeq.js";import"./InputLabel-CnhDo5aY.js";import"./Select-Bk_6znan.js";import"./Popover-C0hTF1EH.js";import"./MenuItem-C2NdwYGU.js";import"./Checkbox-CAwi0hQQ.js";import"./SwitchBase-qYG6LXgU.js";import"./Chip-BkZK611R.js";import"./Link-Bbtl6_jS.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-DGWPdt_D.js";import"./useIsomorphicLayoutEffect-CWGQpdG-.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-BfgHxZ5V.js";import"./useDebounce-D_raU2hF.js";import"./InputAdornment-CIRedfIj.js";import"./TextField-CM9PjYSi.js";import"./useElementFilter-So0OUJh9.js";import"./EmptyState-fsuOQ5Mu.js";import"./Progress-aE01bH1X.js";import"./LinearProgress-DZ8ZrlNO.js";import"./ResponseErrorPanel-DEXNZ5kD.js";import"./ErrorPanel-C-auWv_U.js";import"./WarningPanel-BZPI4iuJ.js";import"./MarkdownContent-lOphwaGa.js";import"./CodeSnippet-BiIQ6QnU.js";import"./CopyTextButton-D74HsvCl.js";import"./useCopyToClipboard-B1BfXZ6A.js";import"./Tooltip-DuxoX6f6.js";import"./Popper-Bfi8Jp6K.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
