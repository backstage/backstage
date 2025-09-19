import{j as t,m as d,I as u,b as h,T as g}from"./iframe-BkB0QVAX.js";import{r as x}from"./plugin-CBIYz47d.js";import{S as m,u as n,a as S}from"./useSearchModal-CwIfXAVw.js";import{B as c}from"./Button-VsEN5bia.js";import{a as f,b as M,c as j}from"./DialogTitle-BDGKjWc8.js";import{B as C}from"./Box-BYh2ueao.js";import{S as r}from"./Grid-GzVmgdg9.js";import{S as y}from"./SearchType-QBgl0zIM.js";import{L as I}from"./List-CL3RsQbd.js";import{H as R}from"./DefaultResultListItem-DqdRQxY8.js";import{s as B,M as D}from"./api-B9NsujrE.js";import{S as T}from"./SearchContext-CutOky_8.js";import{w as k}from"./appWrappers-BeDZegEM.js";import{SearchBar as v}from"./SearchBar-DduueW93.js";import{a as b}from"./SearchResult-Z85D2TjE.js";import"./preload-helper-D9Z9MdNV.js";import"./index-6E8IA5LZ.js";import"./Plugin-BB1nd9si.js";import"./componentData-BqyKlC7z.js";import"./useAnalytics-BaiO7IUZ.js";import"./useApp-BcKqXm1b.js";import"./useRouteRef-D7AJ89qx.js";import"./index-CG9-iTWl.js";import"./ArrowForward-BeJ_-l-J.js";import"./translation-DT5kAPsL.js";import"./Page-BFm0CYZX.js";import"./useMediaQuery-DXeV88vM.js";import"./Divider-BE4Qblaw.js";import"./ArrowBackIos-B6gUAtFx.js";import"./ArrowForwardIos-DAbwft3o.js";import"./translation-DJ6bd_y4.js";import"./Modal-BGWqml8P.js";import"./Portal-CniYJQFb.js";import"./Backdrop-V6ewlv6k.js";import"./styled-BkGenL9r.js";import"./ExpandMore-BpFbETJI.js";import"./useAsync-xBHTNlYp.js";import"./useMountedState-pzVPha7m.js";import"./AccordionDetails-BPj0HgKP.js";import"./index-DnL3XN75.js";import"./Collapse-CFXKULw1.js";import"./ListItem-uoYhpxef.js";import"./ListContext-1D3zRM57.js";import"./ListItemIcon-Doegkffe.js";import"./ListItemText-ClLUctdJ.js";import"./Tabs-BoU4aQPm.js";import"./KeyboardArrowRight-zBzimIr4.js";import"./FormLabel-ClUz7mT-.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-D0qRsh9W.js";import"./InputLabel-CyJm0unI.js";import"./Select-BbTHpLlz.js";import"./Popover-Kzi_v5IP.js";import"./MenuItem-gWsmckXV.js";import"./Checkbox-D4VTcckx.js";import"./SwitchBase-_iX5HTV7.js";import"./Chip-BX5-72Nu.js";import"./Link-DEl3EO73.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-ix0ZtonL.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-CcOwJtDO.js";import"./useDebounce-CGsg-vmQ.js";import"./InputAdornment-D-HpLPwD.js";import"./TextField-DSM0WJpF.js";import"./useElementFilter-Cn9M9skL.js";import"./EmptyState-BS6RXamS.js";import"./Progress-GBe0RL6j.js";import"./LinearProgress-CRaYMVia.js";import"./ResponseErrorPanel-JKwZtHUH.js";import"./ErrorPanel-33EFS4fI.js";import"./WarningPanel-C4fTNgaU.js";import"./MarkdownContent-C_11qXRU.js";import"./CodeSnippet-928r43_H.js";import"./CopyTextButton-SuTXHCNw.js";import"./useCopyToClipboard-ybsekL_1.js";import"./Tooltip-Cw7U8Fon.js";import"./Popper-CoIZ3FWg.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},io={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const ao=["Default","CustomModal"];export{i as CustomModal,s as Default,ao as __namedExportsOrder,io as default};
